import {fail} from "@sveltejs/kit";
import type {Actions} from "./$types";
import {UserService} from "$lib/services/UserService";

export const actions: Actions = {
  default: async ({request}) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();

    if (!email) {
      return fail(400, {error: "Email is required"});
    }

    try {
      const result = await UserService.requestPasswordReset(email);

      if (!result.success) {
        return fail(400, {error: result.message});
      }

      return {
        success: true,
        message:
          "If your email exists in our system, you will receive a password reset link shortly.",
      };
    } catch (error) {
      console.error("Error requesting password reset:", error);
      return fail(500, {
        error:
          "An error occurred while processing your request. Please try again later.",
      });
    }
  },
};
