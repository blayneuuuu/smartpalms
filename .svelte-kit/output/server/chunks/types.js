import bcrypt from "bcryptjs";
import { d as db, u as users } from "./index2.js";
import { eq } from "drizzle-orm";
import { r as redirect } from "./index.js";
import { z } from "zod";
const SALT_ROUNDS = 10;
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
async function createUser(name, email, password, type = "user") {
  const hashedPassword = await hashPassword(password);
  const [user] = await db.insert(users).values({
    id: crypto.randomUUID(),
    name,
    email,
    password: hashedPassword,
    type
  }).returning();
  return user;
}
async function verifyUser(email, password) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return null;
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;
  return user;
}
async function requireUser(locals) {
  if (!locals.user) {
    throw redirect(303, "/");
  }
  return locals.user;
}
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
  confirmPassword: z.string().optional()
}).refine(
  (data) => {
    if (data.newPassword) {
      return data.newPassword === data.confirmPassword;
    }
    return true;
  },
  {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  }
).refine(
  (data) => {
    if (data.newPassword) {
      return !!data.currentPassword;
    }
    return true;
  },
  {
    message: "Current password is required to change password",
    path: ["currentPassword"]
  }
);
export {
  registerSchema as a,
  createUser as c,
  loginSchema as l,
  profileUpdateSchema as p,
  requireUser as r,
  verifyUser as v
};
