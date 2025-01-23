// src/hooks.server.ts
import type {Handle} from "@sveltejs/kit";
import {db} from "$lib/server/db";
import {users} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";

export const handle: Handle = async ({event, resolve}) => {
  const session = event.cookies.get("session");

  if (!session) {
    return await resolve(event);
  }

  const [user] = await db.select().from(users).where(eq(users.id, session));

  if (user) {
    const {password: _, ...safeUser} = user;
    event.locals.user = safeUser;
  }

  return await resolve(event);
};
