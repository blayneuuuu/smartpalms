import { r as redirect } from "../../../chunks/index.js";
import { d as db, u as users } from "../../../chunks/index2.js";
import { eq } from "drizzle-orm";
const load = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, "/");
  }
  const [userData] = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    type: users.type
  }).from(users).where(eq(users.id, locals.user.id));
  if (!userData) {
    throw redirect(302, "/");
  }
  return {
    userData
  };
};
export {
  load
};
