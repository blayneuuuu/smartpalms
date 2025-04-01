import { json } from "@sveltejs/kit";
import { users } from "$lib/server/db/schema";
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
    // Query the users table for the given ID and check type
    const user = await db.select().from(users).where(eq(users.id, id)).get();

    if (user && user.type === "admin") {
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
