import { json } from "@sveltejs/kit";
import { admins } from "$lib/server/db/schema";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";

/**
 * GET /api/admin/[id]
 * Checks if the given ID is an admin.
 */
export const GET: RequestHandler = async ({
  params,
}: {
  params: { id: string };
}) => {
  const { id } = params;

  try {
    // Query the `admins` table for the given user ID
    const admin = await db
      .select()
      .from(admins)
      .where(eq(admins.userId, id))
      .get();

    if (admin) {
      return json({ authenticated: true, message: "User is an admin." });
    } else {
      return json({ authenticated: false, message: "User is not an admin." });
    }
  } catch (error) {
    console.error("Error checking admin:", error);
    return json(
      {
        authenticated: false,
        message: "Error occurred while checking admin status.",
      },
      { status: 500 },
    );
  }
};
