import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { UserService } from "$lib/services/UserService";

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();

    if (!email) {
      return fail(400, { error: "Email is required" });
    }

    const result = await UserService.resendVerificationEmail(email);

    if (!result.success) {
      return fail(400, { error: result.message });
    }

    return { success: true, message: result.message };
  },
};
