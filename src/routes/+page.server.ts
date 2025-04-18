import {fail, redirect} from "@sveltejs/kit";
import type {Actions, PageServerLoad} from "./$types";
import {db} from "$lib/db/db";
import {users, unverifiedUsers} from "$lib/db/schema";
import {eq} from "drizzle-orm";
import bcrypt from "bcrypt";

// Function to redirect authenticated users to dashboard
export const load: PageServerLoad = async ({locals, url}) => {
  // If logged in but requesting root, redirect to dashboard
  // Don't redirect if there are URL parameters (like logged_out, expired, etc.)
  if (locals.user && url.search === "") {
    throw redirect(302, "/dashboard");
  }

  // Return user info for the page
  return {
    user: locals.user || null,
  };
};

export const actions: Actions = {
  default: async ({request, cookies}) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const returnUrl = formData.get("returnUrl")?.toString() || "";

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

      // Check if account is blocked or suspended
      if (["blocked", "suspended"].includes(user.status || "")) {
        // Set session cookie first so the user can access account status page
        cookies.set("session", user.id, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 8, // 8 hours session timeout
        });

        // Redirect to account status page
        return {
          success: true,
          redirect: "/account-status",
        };
      }

      // Set session cookie
      cookies.set("session", user.id, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 8, // 8 hours session timeout
      });

      // Return a success result with redirect info
      return {
        success: true,
        redirect: returnUrl ? decodeURIComponent(returnUrl) : "/dashboard",
      };
    } catch (error) {
      console.error("Login error:", error);
      return fail(500, {error: "An error occurred during login"});
    }
  },
} satisfies Actions;
