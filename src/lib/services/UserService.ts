import crypto from "crypto";
import {db} from "$lib/db/db";
import {users, unverifiedUsers} from "$lib/db/schema";
import {eq} from "drizzle-orm";
import bcrypt from "bcrypt";
import {sendVerificationEmail} from "./EmailService";

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

      // Set token expiry to 24 hours from now
      const tokenExpiry = new Date();
      tokenExpiry.setHours(tokenExpiry.getHours() + 24);

      // Insert into unverified users table
      await db
        .insert(unverifiedUsers)
        .values({
          id: crypto.randomUUID(),
          name,
          email,
          password: hashedPassword,
          verificationToken,
          tokenExpiry: tokenExpiry,
        })
        .returning();

      // Send verification email
      await sendVerificationEmail(email, name, verificationToken);

      return {
        success: true,
        message:
          "Registration successful. Please check your email to verify your account.",
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

      // Check if token is expired
      const tokenExpiry = new Date(unverifiedUser.tokenExpiry);
      if (tokenExpiry < new Date()) {
        return {
          success: false,
          message: "Verification token has expired",
        };
      }

      // Transfer the user from unverified to verified users table
      const [newUser] = await db
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          name: unverifiedUser.name,
          email: unverifiedUser.email,
          password: unverifiedUser.password,
          type: "user",
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

      // Set token expiry to 24 hours from now
      const tokenExpiry = new Date();
      tokenExpiry.setHours(tokenExpiry.getHours() + 24);

      // Update verification token and expiry
      await db
        .update(unverifiedUsers)
        .set({
          verificationToken,
          tokenExpiry: tokenExpiry,
        })
        .where(eq(unverifiedUsers.id, unverifiedUser.id));

      // Send verification email
      await sendVerificationEmail(
        unverifiedUser.email,
        unverifiedUser.name,
        verificationToken
      );

      return {
        success: true,
        message: "Verification email resent. Please check your inbox.",
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
