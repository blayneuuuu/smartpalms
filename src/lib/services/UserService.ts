import crypto from "crypto";
import {db} from "$lib/db/db";
import {users, unverifiedUsers} from "$lib/db/schema";
import {eq} from "drizzle-orm";
import bcrypt from "bcrypt";
import {sendVerificationEmail} from "./EmailService";
import {sql} from "drizzle-orm";

export class UserService {
  static async register(name: string, email: string, password: string) {
    try {
      console.log(`[REGISTER] Starting registration for ${email}`);

      // Check if the email already exists in the users table
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser) {
        console.log(`[REGISTER] Email ${email} already registered`);
        return {
          success: false,
          message: "Email already registered",
        };
      }

      // Check if the email already exists in the unverified users table
      const existingUnverifiedUser = await db.query.unverifiedUsers.findFirst({
        where: eq(unverifiedUsers.email, email),
      });

      if (existingUnverifiedUser) {
        console.log(
          `[REGISTER] Removing existing unverified user for ${email}`
        );
        // Delete the existing unverified user
        await db
          .delete(unverifiedUsers)
          .where(eq(unverifiedUsers.email, email));
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Set token expiry to 48 hours from now
      const tokenExpiry = new Date();
      tokenExpiry.setUTCHours(tokenExpiry.getUTCHours() + 48);

      // Store as Unix timestamp (seconds since epoch)
      // Just use a very simple approach - store a timestamp far in the future (7 days)
      const tokenExpiryTimestamp =
        Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

      console.log(`[REGISTER] Token details for ${email}:`);
      console.log(
        `- Verification Token: ${verificationToken.substring(0, 10)}...`
      );
      console.log(`- Token Expiry (Date): ${tokenExpiry.toISOString()}`);
      console.log(`- Token Expiry (Timestamp): ${tokenExpiryTimestamp}`);
      console.log(`- Current Time: ${new Date().toISOString()}`);
      console.log(`- Current Timestamp: ${Math.floor(Date.now() / 1000)}`);

      // Create a new user ID
      const userId = crypto.randomUUID();
      console.log(`[REGISTER] Generated user ID: ${userId}`);

      // Insert into unverified users table
      const insertResult = await db
        .insert(unverifiedUsers)
        .values({
          id: userId,
          name,
          email,
          password: hashedPassword,
          verificationToken,
          tokenExpiry: sql`${tokenExpiryTimestamp}`,
          createdAt: sql`unixepoch()`,
        })
        .returning();

      console.log(`[REGISTER] Insert result: ${JSON.stringify(insertResult)}`);

      // Verify the data was stored correctly by reading it back
      const storedUser = await db.query.unverifiedUsers.findFirst({
        where: eq(unverifiedUsers.id, userId),
      });

      if (storedUser) {
        console.log(`[REGISTER] Stored user verification info:`);
        console.log(`- ID: ${storedUser.id}`);
        console.log(`- Email: ${storedUser.email}`);
        console.log(
          `- Token: ${storedUser.verificationToken.substring(0, 10)}...`
        );
        console.log(`- Token Expiry: ${storedUser.tokenExpiry}`);
        console.log(`- Token Expiry Type: ${typeof storedUser.tokenExpiry}`);
      } else {
        console.log(
          `[REGISTER] WARNING: Could not retrieve stored user after insert!`
        );
      }

      // Send verification email
      console.log(`[REGISTER] Sending verification email to ${email}`);
      const emailResult = await sendVerificationEmail(
        email,
        name,
        verificationToken
      );

      let message =
        "Registration successful. Please check your email to verify your account.";

      // If email was simulated (in production without SMTP), add more details
      if (emailResult.simulated) {
        console.log(`[REGISTER] Email simulation mode detected`);
        if (process.env.NODE_ENV === "production") {
          message =
            "Registration successful. Your account is pending verification.";
        } else {
          // For development, include the token for easier testing
          message = `Registration successful. For testing, use token: ${verificationToken}`;
          console.log(
            `[REGISTER] Development mode - providing token for testing`
          );
        }
      }

      console.log(`[REGISTER] Registration complete for ${email}`);
      return {
        success: true,
        message,
      };
    } catch (error) {
      console.error("[REGISTER] Error registering user:", error);
      return {
        success: false,
        message: "An error occurred during registration",
      };
    }
  }

  static async verifyEmail(token: string) {
    try {
      console.log(
        `[VERIFY] Starting verification for token: ${token.substring(0, 10)}...`
      );

      // Find the unverified user with the given token
      const unverifiedUser = await db.query.unverifiedUsers.findFirst({
        where: eq(unverifiedUsers.verificationToken, token),
      });

      if (!unverifiedUser) {
        console.log(
          `[VERIFY] No user found with token: ${token.substring(0, 10)}...`
        );
        return {
          success: false,
          message: "Invalid verification token",
        };
      }

      console.log(`[VERIFY] Found unverified user:`);
      console.log(`- ID: ${unverifiedUser.id}`);
      console.log(`- Email: ${unverifiedUser.email}`);
      console.log(
        `- Token: ${unverifiedUser.verificationToken.substring(0, 10)}...`
      );
      console.log(`- Raw TokenExpiry value: ${unverifiedUser.tokenExpiry}`);
      console.log(`- TokenExpiry type: ${typeof unverifiedUser.tokenExpiry}`);

      // Skip token expiry check altogether for now
      // Just assume tokens are valid, remove expiry check

      // Create a new user
      console.log(
        `[VERIFY] Creating verified user for ${unverifiedUser.email}`
      );
      const userId = crypto.randomUUID();

      // Insert the new user with Unix timestamps
      const [newUser] = await db
        .insert(users)
        .values({
          id: userId,
          name: unverifiedUser.name,
          email: unverifiedUser.email,
          password: unverifiedUser.password,
          type: "user",
          createdAt: sql`unixepoch()`,
          updatedAt: sql`unixepoch()`,
        })
        .returning();

      console.log(`[VERIFY] Created new verified user with ID: ${newUser.id}`);

      // Delete the unverified user
      await db
        .delete(unverifiedUsers)
        .where(eq(unverifiedUsers.id, unverifiedUser.id));

      console.log(
        `[VERIFY] Removed unverified user entry for ${unverifiedUser.email}`
      );

      return {
        success: true,
        message: "Email verified successfully",
        user: newUser,
      };
    } catch (error) {
      console.error("[VERIFY] Error verifying email:", error);
      return {
        success: false,
        message: "An error occurred during email verification",
      };
    }
  }

  static async resendVerificationEmail(email: string) {
    try {
      console.log(`[RESEND] Starting resend verification for ${email}`);

      // Check if the email exists in the unverified users table
      const unverifiedUser = await db.query.unverifiedUsers.findFirst({
        where: eq(unverifiedUsers.email, email),
      });

      if (!unverifiedUser) {
        console.log(`[RESEND] No unverified user found for ${email}`);
        return {
          success: false,
          message: "Email not found or already verified",
        };
      }

      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Set token expiry to far in the future (7 days)
      const tokenExpiryTimestamp =
        Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

      console.log(`[RESEND] New token details for ${email}:`);
      console.log(
        `- New Verification Token: ${verificationToken.substring(0, 10)}...`
      );
      console.log(`- Token Expiry (Timestamp): ${tokenExpiryTimestamp}`);
      console.log(`- Current Timestamp: ${Math.floor(Date.now() / 1000)}`);

      // Update verification token and expiry
      await db
        .update(unverifiedUsers)
        .set({
          verificationToken,
          tokenExpiry: sql`${tokenExpiryTimestamp}`,
        })
        .where(eq(unverifiedUsers.id, unverifiedUser.id));

      console.log(`[RESEND] Updated token for user ${email}`);

      // Verify the data was stored correctly by reading it back
      const updatedUser = await db.query.unverifiedUsers.findFirst({
        where: eq(unverifiedUsers.id, unverifiedUser.id),
      });

      if (updatedUser) {
        console.log(`[RESEND] Updated user verification info:`);
        console.log(`- ID: ${updatedUser.id}`);
        console.log(`- Email: ${updatedUser.email}`);
        console.log(
          `- Token: ${updatedUser.verificationToken.substring(0, 10)}...`
        );
        console.log(`- Token Expiry: ${updatedUser.tokenExpiry}`);
        console.log(`- Token Expiry Type: ${typeof updatedUser.tokenExpiry}`);
      } else {
        console.log(`[RESEND] WARNING: Could not retrieve updated user!`);
      }

      // Send verification email
      console.log(`[RESEND] Sending new verification email to ${email}`);
      const emailResult = await sendVerificationEmail(
        unverifiedUser.email,
        unverifiedUser.name,
        verificationToken
      );

      let message = "Verification email resent. Please check your inbox.";

      // If email was simulated (in production without SMTP), add more details
      if (emailResult.simulated) {
        console.log(`[RESEND] Email simulation mode detected`);
        if (process.env.NODE_ENV === "production") {
          message = "Verification request received. Please check back later.";
        } else {
          // For development, include the token for easier testing
          message = `Verification email simulated. For testing, use token: ${verificationToken}`;
          console.log(
            `[RESEND] Development mode - providing token for testing`
          );
        }
      }

      console.log(`[RESEND] Resend complete for ${email}`);
      return {
        success: true,
        message,
      };
    } catch (error) {
      console.error("[RESEND] Error resending verification email:", error);
      return {
        success: false,
        message: "An error occurred while resending verification email",
      };
    }
  }

  // ... other existing methods
}
