import {fail} from "@sveltejs/kit";
import type {Actions} from "./$types";
import {UserService} from "$lib/services/UserService";

export const actions: Actions = {
  default: async ({request}) => {
    const formData = await request.formData();
    const token = formData.get("token")?.toString();

    if (!token) {
      return fail(400, {error: "Verification token is required"});
    }

    const result = await UserService.verifyEmail(token);

    if (!result.success) {
      return fail(400, {error: result.message});
    }

    return {success: true, message: result.message};
  },
};
