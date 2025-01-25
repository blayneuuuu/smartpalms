import { f as fail } from "../../../chunks/index.js";
import { r as requireUser, p as profileUpdateSchema } from "../../../chunks/types.js";
import { d as db, u as users } from "../../../chunks/index2.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
const load = async ({ locals }) => {
  const user = await requireUser(locals);
  return { user };
};
const actions = {
  default: async ({ request, locals }) => {
    const user = await requireUser(locals);
    const data = await request.formData();
    const formData = {
      name: data.get("name")?.toString() ?? "",
      email: data.get("email")?.toString() ?? "",
      currentPassword: data.get("currentPassword")?.toString() ?? void 0,
      newPassword: data.get("newPassword")?.toString() ?? void 0,
      confirmPassword: data.get("confirmPassword")?.toString() ?? void 0
    };
    const result = profileUpdateSchema.safeParse(formData);
    if (!result.success) {
      const { errors } = result.error;
      return fail(400, { error: errors[0].message });
    }
    if (formData.email !== user.email) {
      const [existingUser] = await db.select().from(users).where(eq(users.email, formData.email));
      if (existingUser) {
        return fail(400, { error: "Email is already taken" });
      }
    }
    if (formData.currentPassword && formData.newPassword) {
      const [userWithPassword] = await db.select().from(users).where(eq(users.id, user.id));
      const isValid = await bcrypt.compare(
        formData.currentPassword,
        userWithPassword.password
      );
      if (!isValid) {
        return fail(400, { error: "Current password is incorrect" });
      }
      const hashedPassword = await bcrypt.hash(formData.newPassword, 10);
      await db.update(users).set({
        name: formData.name,
        email: formData.email,
        password: hashedPassword,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users.id, user.id));
    } else {
      await db.update(users).set({
        name: formData.name,
        email: formData.email,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users.id, user.id));
    }
    return { success: "Profile updated successfully" };
  }
};
export {
  actions,
  load
};
