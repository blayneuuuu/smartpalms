import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";

export const GET: RequestHandler = async ({locals}) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        {authenticated: false, message: "User is not an admin."},
        {status: 403}
      );
    }

    return json({
      success: true,
      message: "Test endpoint working correctly",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in test endpoint:", error);
    return json({message: "Test endpoint error"}, {status: 500});
  }
};
