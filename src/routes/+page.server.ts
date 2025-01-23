import {fail, redirect} from "@sveltejs/kit";
import {verifyUser} from "$lib/server/auth";
import {loginSchema} from "$lib/types";
import type {Actions} from "./$types";

export const actions = {
  default: async ({request, cookies}) => {
    const data = await request.formData();
    const formData = {
      email: data.get("email")?.toString() ?? "",
      password: data.get("password")?.toString() ?? "",
    };

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const {errors} = result.error;
      return fail(400, {error: errors[0].message});
    }

    const user = await verifyUser(formData.email, formData.password);

    if (!user) {
      return fail(400, {error: "Invalid email or password"});
    }

    // Set session cookie
    cookies.set("session", user.id, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    throw redirect(303, "/dashboard");
  },
} satisfies Actions;
