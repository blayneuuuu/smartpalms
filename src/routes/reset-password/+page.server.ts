import {fail} from "@sveltejs/kit";
import type {Actions} from "@sveltejs/kit";
import type {ServerLoad} from "@sveltejs/kit";
import {UserService} from "$lib/services/UserService";

export const load: ServerLoad = async ({url}) => {
  const token = url.searchParams.get("token");

  // If no token is provided, mark it as invalid
  if (!token) {
    return {
      invalidToken: true,
    };
  }

  return {
    invalidToken: false,
  };
};

export const actions: Actions = {
  default: async ({request}) => {
    const formData = await request.formData();
    const token = formData.get("token")?.toString();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    // Validate inputs
    if (!token) {
      return fail(400, {error: "Reset token is missing"});
    }

    if (!password || !confirmPassword) {
      return fail(400, {error: "Password and confirmation are required"});
    }

    if (password.length < 8) {
      return fail(400, {error: "Password must be at least 8 characters long"});
    }

    if (password !== confirmPassword) {
      return fail(400, {error: "Passwords do not match"});
    }

    try {
      const result = await UserService.resetPassword(token, password);

      if (!result.success) {
        return fail(400, {error: result.message});
      }

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      console.error("Error resetting password:", error);
      return fail(500, {
        error:
          "An error occurred while resetting your password. Please try again later.",
      });
    }
  },
};
