import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";

/**
 * API endpoint to extend the user's session
 * This is called by the client when a user is active to prevent session timeout
 */
export const POST: RequestHandler = async ({cookies, locals}) => {
  if (!locals.user) {
    return json({success: false, message: "Not authenticated"}, {status: 401});
  }

  // Get current session
  const sessionId = cookies.get("session");

  if (!sessionId) {
    return json({success: false, message: "No session found"}, {status: 401});
  }

  // Refresh the session cookie
  cookies.set("session", sessionId, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return json({success: true, message: "Session extended"});
};
