import type {PageServerLoad} from "./$types";
import {UserService} from "$lib/services/UserService";

export const load: PageServerLoad = async ({url}) => {
  const token = url.searchParams.get("token");

  if (!token) {
    return {
      error: "Verification token is missing",
      success: false,
    };
  }

  const result = await UserService.verifyEmail(token);

  if (result.success) {
    return {
      success: true,
      message: result.message,
    };
  }

  return {
    error: result.message,
    success: false,
  };
};
