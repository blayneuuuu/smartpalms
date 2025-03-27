import {fail} from "@sveltejs/kit";
import type {Actions} from "./$types";
import {db} from "$lib/db/db";
import {users, unverifiedUsers} from "$lib/db/schema";
import {eq} from "drizzle-orm";
import bcrypt from "bcrypt";

export const actions: Actions = {
  default: async ({request, cookies}) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    // Basic validation
    if (!email || !password) {
      return fail(400, {error: "Email and password are required"});
    }

    try {
      // Check if user exists in verified users table
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      // If user is not in the verified table, check if they exist in unverified table
      if (!user) {
        const unverifiedUser = await db.query.unverifiedUsers.findFirst({
          where: eq(unverifiedUsers.email, email),
        });

        if (unverifiedUser) {
          return fail(400, {
            error:
              "Please verify your email address before logging in. Check your inbox for a verification link or request a new one.",
          });
        }

        return fail(400, {error: "Invalid email or password"});
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return fail(400, {error: "Invalid email or password"});
      }

      // Set session cookie
      cookies.set("session", user.id, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      // Return a success result with redirect info instead of throwing a redirect
      return {
        success: true,
        redirect: "/dashboard",
      };
    } catch (error) {
      console.error("Login error:", error);
      return fail(500, {error: "An error occurred during login"});
    }
  },
} satisfies Actions;
