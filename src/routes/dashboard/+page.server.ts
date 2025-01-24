import type {PageServerLoad} from "./$types";
import {redirect} from "@sveltejs/kit";
import {db} from "$lib/server/db";
import {users} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";

export const load: PageServerLoad = async ({locals}) => {
  if (!locals.user) {
    throw redirect(302, "/");
  }

  // Get user data
  const [userData] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      type: users.type,
    })
    .from(users)
    .where(eq(users.id, locals.user.id));

  if (!userData) {
    throw redirect(302, "/");
  }

  return {
    userData,
  };
};
