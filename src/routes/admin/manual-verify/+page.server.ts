import {fail, redirect} from "@sveltejs/kit";
import type {Actions, PageServerLoad} from "./$types";
import {db} from "$lib/db/db";
import {users, unverifiedUsers} from "$lib/db/schema";
import {eq} from "drizzle-orm";
import crypto from "crypto";

// Load the list of unverified users
export const load: PageServerLoad = async ({locals}) => {
  // Check if user is an admin (you should implement proper auth check)
  const userId = locals.user?.id;
  if (!userId) {
    throw redirect(302, "/");
  }

  // Get user from database
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  // Check if user is admin
  if (!user || user.type !== "admin") {
    throw redirect(302, "/");
  }

  // Load unverified users
  const pendingUsers = await db.query.unverifiedUsers.findMany();

  return {
    pendingUsers,
  };
};

export const actions: Actions = {
  default: async ({request, locals}) => {
    // Check if user is an admin (implement proper auth check)
    const userId = locals.user?.id;
    if (!userId) {
      return fail(403, {error: "Unauthorized"});
    }

    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    // Check if user is admin
    if (!user || user.type !== "admin") {
      return fail(403, {error: "Admin access required"});
    }

    const formData = await request.formData();
    const unverifiedUserId = formData.get("userId")?.toString();

    if (!unverifiedUserId) {
      return fail(400, {error: "User ID is required"});
    }

    try {
      // Get the unverified user
      const unverifiedUser = await db.query.unverifiedUsers.findFirst({
        where: eq(unverifiedUsers.id, unverifiedUserId),
      });

      if (!unverifiedUser) {
        return fail(404, {error: "User not found"});
      }

      // Transfer to verified users table
      await db
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          name: unverifiedUser.name,
          email: unverifiedUser.email,
          password: unverifiedUser.password,
          type: "user",
        })
        .returning();

      // Delete from unverified
      await db
        .delete(unverifiedUsers)
        .where(eq(unverifiedUsers.id, unverifiedUserId));

      return {
        success: true,
        message: `User ${unverifiedUser.email} has been manually verified`,
      };
    } catch (error) {
      console.error("Error verifying user:", error);
      return fail(500, {error: "An error occurred during verification"});
    }
  },
};
