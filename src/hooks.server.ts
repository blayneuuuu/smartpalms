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

  const user = await db.query.users.findFirst({
    where: eq(users.id, session),
    columns: {
      id: true,
      email: true,
      name: true,
      type: true,
    },
  });

  if (user) {
    event.locals.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.type,
    };
  }

  return await resolve(event);
};
