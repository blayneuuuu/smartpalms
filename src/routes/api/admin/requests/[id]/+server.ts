import {json} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {UserService} from "$lib/services/core/user.service";
import {directClient} from "$lib/db/direct-client";
import crypto from "crypto";

export const PUT: RequestHandler = async ({params, request, locals}) => {
  if (!locals.user || locals.user.type !== "admin") {
    throw error(401, "Unauthorized");
  }

  const requestId = params.id;
  if (!requestId) {
    throw error(400, "Request ID is required");
  }

  try {
    const {status, rejectionReason} = await request.json();

    // Get the request details - using direct SQL for more reliability
    try {
      const lockerRequestResult = await directClient.execute({
        sql: `
          SELECT * FROM locker_requests 
          WHERE id = ?
        `,
        args: [requestId],
      });

      if (lockerRequestResult.rows.length === 0) {
        throw error(404, "Request not found");
      }

      const lockerRequest = lockerRequestResult.rows[0];

      // Get subscription type
      const subscriptionTypeResult = await directClient.execute({
        sql: `
          SELECT * FROM subscription_types 
          WHERE id = ?
        `,
        args: [lockerRequest.subscription_type_id],
      });

      if (subscriptionTypeResult.rows.length === 0) {
        throw error(404, "Subscription type not found");
      }

      const subscriptionType = subscriptionTypeResult.rows[0];

      // Get the locker
      const lockerResult = await directClient.execute({
        sql: `
          SELECT * FROM lockers 
          WHERE id = ?
        `,
        args: [lockerRequest.locker_id],
      });

      if (lockerResult.rows.length === 0) {
        throw error(404, "Locker not found");
      }

      const locker = lockerResult.rows[0];

      if (status === "approve") {
        // First check if the locker is physically occupied
        if (locker.is_occupied) {
          throw error(400, "Locker is marked as occupied");
        }

        // Then check if locker is already assigned to an active subscription
        const existingSubscriptionResult = await directClient.execute({
          sql: `
            SELECT * FROM subscriptions 
            WHERE locker_id = ? AND status = 'active'
          `,
          args: [lockerRequest.locker_id],
        });

        if (existingSubscriptionResult.rows.length > 0) {
          throw error(400, "Locker already has an active subscription");
        }

        // Calculate expiry date based on subscription type duration
        let daysToAdd = 0;
        switch (subscriptionType.duration) {
          case "1_day":
            daysToAdd = 1;
            break;
          case "3_days":
            daysToAdd = 3;
            break;
          case "7_days":
            daysToAdd = 7;
            break;
          case "30_days":
            daysToAdd = 30;
            break;
          default:
            throw error(400, "Invalid subscription duration");
        }

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + daysToAdd);

        // Generate UUIDs for subscription and transaction
        const subscriptionId = crypto.randomUUID();
        const transactionId = crypto.randomUUID();
        const now = Math.floor(Date.now() / 1000); // Unix timestamp

        // Create subscription using direct SQL
        await directClient.execute({
          sql: `
            INSERT INTO subscriptions (
              id, user_id, locker_id, status, expires_at, created_at
            ) VALUES (?, ?, ?, ?, ?, ?)
          `,
          args: [
            subscriptionId,
            lockerRequest.user_id,
            lockerRequest.locker_id,
            "active",
            expiryDate.toISOString(),
            now,
          ],
        });

        // Create transaction using direct SQL
        await directClient.execute({
          sql: `
            INSERT INTO transactions (
              id, user_id, amount, subscription_id, status, proof_of_payment, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            transactionId,
            lockerRequest.user_id,
            subscriptionType.amount?.toString() || "0",
            subscriptionId,
            "success",
            lockerRequest.proof_of_payment
              ? String(lockerRequest.proof_of_payment)
              : "",
            now,
          ],
        });

        // Update locker status using direct SQL
        await directClient.execute({
          sql: `
            UPDATE lockers 
            SET user_id = ?, is_occupied = 1 
            WHERE id = ?
          `,
          args: [lockerRequest.user_id, lockerRequest.locker_id],
        });

        // Update user status to "subscribed" using UserService
        if (lockerRequest.user_id) {
          const userStatusResult =
            await UserService.updateUserStatusBasedOnSubscriptions(
              String(lockerRequest.user_id)
            );

          console.log(
            `User status update on locker approval: ${
              userStatusResult.success
                ? `Successfully updated to ${userStatusResult.status === null ? "unknown" : userStatusResult.status}`
                : `Failed: ${userStatusResult.error}`
            }`
          );
        } else {
          console.warn("Cannot update user status: user_id is null");
        }

        // Update and then remove the request
        await directClient.execute({
          sql: `
            UPDATE locker_requests 
            SET status = 'approved', processed_at = ?, processed_by = ? 
            WHERE id = ?
          `,
          args: [now, locals.user.id, requestId],
        });

        await directClient.execute({
          sql: `DELETE FROM locker_requests WHERE id = ?`,
          args: [requestId],
        });
      } else if (status === "reject") {
        // Update the request with rejection reason
        const now = Math.floor(Date.now() / 1000); // Unix timestamp

        await directClient.execute({
          sql: `
            UPDATE locker_requests 
            SET status = 'rejected', rejection_reason = ?, processed_at = ?, processed_by = ? 
            WHERE id = ?
          `,
          args: [rejectionReason || "", now, locals.user.id, requestId],
        });
      }

      return json({
        success: true,
        message:
          status === "approve"
            ? "Request approved successfully"
            : "Request rejected successfully",
      });
    } catch (dbError: unknown) {
      console.error("Database error while processing request:", dbError);

      // Provide more specific error for schema issues
      if (
        typeof dbError === "object" &&
        dbError !== null &&
        "message" in dbError &&
        typeof dbError.message === "string" &&
        dbError.message.includes("no such table")
      ) {
        return json(
          {
            success: false,
            message:
              "Database schema issue detected. Please run the database fix script.",
            error: "Database migration issue",
          },
          {status: 500}
        );
      }

      throw dbError; // rethrow if it's not a schema issue
    }
  } catch (err) {
    console.error("Error processing request:", err);
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, "Failed to process request");
  }
};
