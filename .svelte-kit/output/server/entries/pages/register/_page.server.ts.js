import { f as fail } from "../../../chunks/index.js";
import { a as registerSchema, c as createUser } from "../../../chunks/types.js";
import { d as db, u as users } from "../../../chunks/index2.js";
import { eq } from "drizzle-orm";
const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const formData = {
      name: data.get("name")?.toString() ?? "",
      email: data.get("email")?.toString() ?? "",
      password: data.get("password")?.toString() ?? "",
      confirmPassword: data.get("confirmPassword")?.toString() ?? ""
    };
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const { errors } = result.error;
      return fail(400, { error: errors[0].message });
    }
    const [existingUser] = await db.select().from(users).where(eq(users.email, formData.email));
    if (existingUser) {
      return fail(400, { error: "Email already exists" });
    }
    try {
      const user = await createUser(
        formData.name,
        formData.email,
        formData.password
      );
      cookies.set("session", user.id, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30
        // 30 days
      });
      return {
        success: true,
        location: "/dashboard"
      };
    } catch (error) {
      console.error("Registration error:", error);
      return fail(500, { error: "Failed to create account" });
    }
  }
};
export {
  actions
};
