import bcrypt from "bcryptjs";
import {db} from "./db";
import {users} from "./db/schema";
import {eq} from "drizzle-orm";
import {redirect} from "@sveltejs/kit";
import type {User} from "./db/schema";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  type: "admin" | "user" = "user"
): Promise<User> {
  const hashedPassword = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      type,
    })
    .returning();
  return user;
}

export async function verifyUser(
  email: string,
  password: string
): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return null;

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;

  return user;
}

export async function requireUser(locals: App.Locals) {
  if (!locals.user) {
    throw redirect(303, "/");
  }
  return locals.user;
}

export async function requireAdmin(locals: App.Locals) {
  const user = await requireUser(locals);
  if (user.type !== "admin") {
    throw redirect(303, "/dashboard");
  }
  return user;
}
