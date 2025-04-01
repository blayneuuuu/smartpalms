import { json, type RequestHandler, error as svelteError } from "@sveltejs/kit";
import { loginSchema } from "$lib/types";
import { AuthService, LockerService } from "$lib/services/core";
import type { EnhancedLockerData } from "$lib/types/responses";

/**
 * Authenticated Access Endpoint
 *
 * This endpoint is designed for authenticating users and returning their
 * locker access information. It's typically used by third-party applications
 * or client apps that need to verify user identity and retrieve their locker data.
 *
 * Authentication is required via email/password, and successful authentication
 * returns the user's profile and their active locker subscriptions.
 *
 * Expected request body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 */

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      const { errors } = result.error;
      throw svelteError(400, errors[0].message);
    }

    // Use the AuthService to authenticate the user
    const user = await AuthService.authenticate(
      result.data.email,
      result.data.password,
    );

    if (!user) {
      throw svelteError(401, "Invalid credentials");
    }

    // Get raw locker data from LockerService
    const rentedLockers = await LockerService.getUserRentedLockers(user.id);

    // Transform to expected response format with enhanced data
    const enhancedLockers: EnhancedLockerData[] = rentedLockers.map(
      ({ locker, subscription, daysUntilExpiration }) => ({
        id: locker.id,
        number: locker.number,
        size: locker.size,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          expiresAt: subscription.expiresAt,
        },
        daysUntilExpiration,
        isExpiringSoon: daysUntilExpiration <= 3,
      }),
    );

    return json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      lockers: enhancedLockers,
    });
  } catch (err) {
    console.error("Authenticated access API error:", err);

    // Check if it's a SvelteKit error
    const svelteKitError = err as { status?: number; message?: string };
    if (svelteKitError && typeof svelteKitError.status === "number") {
      return json(
        {
          success: false,
          message: svelteKitError.message || "An error occurred",
        },
        { status: svelteKitError.status },
      );
    }

    // Handle other errors
    return json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 },
    );
  }
};
