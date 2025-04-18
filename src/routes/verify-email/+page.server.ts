import type {PageServerLoad} from "./$types";
import {UserService} from "$lib/services/UserService";
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async ({url, cookies, locals}) => {
  const token = url.searchParams.get("token");

  if (!token) {
    return {
      error: "Verification token is missing",
      success: false,
    };
  }

  const result = await UserService.verifyEmail(token);

  if (result.success && result.user) {
    // Set session cookie with proper settings
    const userId = result.user.id;

    cookies.set("session", userId, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8, // 8 hours session timeout
    });

    // Also set in locals for this request
    locals.user = {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      type: result.user.type || "user",
      status: result.user.status || "inactive",
    };

    console.log(`[VERIFY] Successfully set session cookie for user ${userId}`);

    return {
      success: true,
      message: result.message,
      user: result.user,
    };
  }

  return {
    error: result.message,
    success: false,
  };
};

export const actions = {
  default: async ({cookies}) => {
    const sessionId = cookies.get("session");
    if (sessionId) {
      console.log(
        `[VERIFY] Redirecting verified user ${sessionId} to dashboard`
      );
      throw redirect(302, "/dashboard");
    }
    return {success: true};
  },
};
