import {redirect} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";

export const GET: RequestHandler = async ({cookies}) => {
  // Clear the session cookie
  cookies.delete("session", {path: "/"});

  // Redirect to login page with logged_out parameter
  throw redirect(302, "/?logged_out=1");
};
