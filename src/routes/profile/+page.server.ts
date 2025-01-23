import {fail} from "@sveltejs/kit";
import {requireUser} from "$lib/server/auth";
import {db} from "$lib/server/db";
import {users} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";
import bcrypt from "bcryptjs";
import {profileUpdateSchema} from "$lib/types";
import type {Actions, PageServerLoad} from "./$types";

export const load: PageServerLoad = async ({locals}) => {
  const user = await requireUser(locals);
  return {user};
};

export const actions = {
  default: async ({request, locals}) => {
    const user = await requireUser(locals);
    const data = await request.formData();
    const formData = {
      name: data.get("name")?.toString() ?? "",
      email: data.get("email")?.toString() ?? "",
      currentPassword: data.get("currentPassword")?.toString() ?? undefined,
      newPassword: data.get("newPassword")?.toString() ?? undefined,
      confirmPassword: data.get("confirmPassword")?.toString() ?? undefined,
    };

    const result = profileUpdateSchema.safeParse(formData);
    if (!result.success) {
      const {errors} = result.error;
      return fail(400, {error: errors[0].message});
    }

    // Check if email is taken by another user
    if (formData.email !== user.email) {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, formData.email));
      if (existingUser) {
        return fail(400, {error: "Email is already taken"});
      }
    }

    // If changing password, verify current password
    if (formData.currentPassword && formData.newPassword) {
      const [userWithPassword] = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id));
      const isValid = await bcrypt.compare(
        formData.currentPassword,
        userWithPassword.password
      );

      if (!isValid) {
        return fail(400, {error: "Current password is incorrect"});
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(formData.newPassword, 10);

      // Update user with new password
      await db
        .update(users)
        .set({
          name: formData.name,
          email: formData.email,
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));
    } else {
      // Update user without changing password
      await db
        .update(users)
        .set({
          name: formData.name,
          email: formData.email,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));
    }

    return {success: "Profile updated successfully"};
  },
} satisfies Actions;
