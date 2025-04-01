import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { UserService } from "$lib/services/UserService";

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    // Form validation
    if (!name || !email || !password || !confirmPassword) {
      return fail(400, { error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return fail(400, { error: "Passwords do not match" });
    }

    if (password.length < 8) {
      return fail(400, {
        error: "Password must be at least 8 characters long",
      });
    }

    // Register the user with email verification
    const result = await UserService.register(name, email, password);

    if (!result.success) {
      return fail(400, { error: result.message });
    }

    // Redirect to confirmation page
    return { success: true, message: result.message };
  },
};
