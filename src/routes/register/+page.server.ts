import {fail, redirect} from "@sveltejs/kit";
import {createUser} from "$lib/server/auth";
import {db} from "$lib/server/db";
import {users} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";
import {registerSchema} from "$lib/types";
import type {Actions} from "./$types";

export const actions = {
  default: async ({request, cookies}) => {
    const data = await request.formData();
    const formData = {
      name: data.get("name")?.toString() ?? "",
      email: data.get("email")?.toString() ?? "",
      password: data.get("password")?.toString() ?? "",
      confirmPassword: data.get("confirmPassword")?.toString() ?? "",
    };

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const {errors} = result.error;
      return fail(400, {error: errors[0].message});
    }

    // Check if email already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, formData.email));
    if (existingUser) {
      return fail(400, {error: "Email already exists"});
    }

    try {
      const user = await createUser(
        formData.name,
        formData.email,
        formData.password
      );

      // Set session cookie
      cookies.set("session", user.id, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      throw redirect(303, "/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      return fail(500, {error: "Failed to create account"});
    }
  },
} satisfies Actions;
