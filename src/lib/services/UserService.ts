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
      // Check if the email already exists in the users table
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser) {
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
        // Delete the existing unverified user
        await db
          .delete(unverifiedUsers)
          .where(eq(unverifiedUsers.email, email));
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Set token expiry to 24 hours from now, using UTC time
      const tokenExpiry = new Date();
      // Set to 48 hours in the future to provide more time for verification
      tokenExpiry.setUTCHours(tokenExpiry.getUTCHours() + 48);

      console.log(`Token will expire at: ${tokenExpiry.toISOString()}`);

      // Insert into unverified users table using Unix timestamp
      await db
        .insert(unverifiedUsers)
        .values({
          id: crypto.randomUUID(),
          name,
          email,
          password: hashedPassword,
          verificationToken,
          tokenExpiry, // Date object for tokenExpiry
          createdAt: sql`unixepoch()`, // Use SQLite's unixepoch() function
        })
        .returning();

      // Send verification email
      const emailResult = await sendVerificationEmail(
        email,
        name,
        verificationToken
      );

      let message =
        "Registration successful. Please check your email to verify your account.";

      // If email was simulated (in production without SMTP), add more details
      if (emailResult.simulated) {
        if (process.env.NODE_ENV === "production") {
          message =
            "Registration successful. Your account is pending verification.";
        } else {
          // For development, include the token for easier testing
          message = `Registration successful. For testing, use token: ${verificationToken}`;
        }
      }

      return {
        success: true,
        message,
      };
    } catch (error) {
      console.error("Error registering user:", error);
      return {
        success: false,
        message: "An error occurred during registration",
      };
    }
  }

  static async verifyEmail(token: string) {
    try {
      // Find the unverified user with the given token
      const unverifiedUser = await db.query.unverifiedUsers.findFirst({
        where: eq(unverifiedUsers.verificationToken, token),
      });

      if (!unverifiedUser) {
        return {
          success: false,
          message: "Invalid or expired verification token",
        };
      }

      // Check if token is expired - tokenExpiry is already a Date object when retrieved from the database
      const now = new Date();

      console.log(`Token expiry time: ${unverifiedUser.tokenExpiry}`);
      console.log(`Current time: ${now.toISOString()}`);

      // Convert both to timestamps for numeric comparison
      const expiryTimestamp = unverifiedUser.tokenExpiry.getTime();
      const nowTimestamp = now.getTime();

      if (expiryTimestamp < nowTimestamp) {
        return {
          success: false,
          message: "Verification token has expired",
        };
      }

      // Create a new user
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
          createdAt: sql`unixepoch()`, // SQLite's unixepoch() function returns Unix timestamp
          updatedAt: sql`unixepoch()`, // SQLite's unixepoch() function returns Unix timestamp
        })
        .returning();

      // Delete the unverified user
      await db
        .delete(unverifiedUsers)
        .where(eq(unverifiedUsers.id, unverifiedUser.id));

      return {
        success: true,
        message: "Email verified successfully",
        user: newUser,
      };
    } catch (error) {
      console.error("Error verifying email:", error);
      return {
        success: false,
        message: "An error occurred during email verification",
      };
    }
  }

  static async resendVerificationEmail(email: string) {
    try {
      // Check if the email exists in the unverified users table
      const unverifiedUser = await db.query.unverifiedUsers.findFirst({
        where: eq(unverifiedUsers.email, email),
      });

      if (!unverifiedUser) {
        return {
          success: false,
          message: "Email not found or already verified",
        };
      }

      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Set token expiry to 48 hours from now, using UTC time
      const tokenExpiry = new Date();
      tokenExpiry.setUTCHours(tokenExpiry.getUTCHours() + 48);

      console.log(`New token will expire at: ${tokenExpiry.toISOString()}`);

      // Update verification token and expiry
      await db
        .update(unverifiedUsers)
        .set({
          verificationToken,
          tokenExpiry, // Date object for tokenExpiry
        })
        .where(eq(unverifiedUsers.id, unverifiedUser.id));

      // Send verification email
      const emailResult = await sendVerificationEmail(
        unverifiedUser.email,
        unverifiedUser.name,
        verificationToken
      );

      let message = "Verification email resent. Please check your inbox.";

      // If email was simulated (in production without SMTP), add more details
      if (emailResult.simulated) {
        if (process.env.NODE_ENV === "production") {
          message = "Verification request received. Please check back later.";
        } else {
          // For development, include the token for easier testing
          message = `Verification email simulated. For testing, use token: ${verificationToken}`;
        }
      }

      return {
        success: true,
        message,
      };
    } catch (error) {
      console.error("Error resending verification email:", error);
      return {
        success: false,
        message: "An error occurred while resending verification email",
      };
    }
  }

  // ... other existing methods
}
