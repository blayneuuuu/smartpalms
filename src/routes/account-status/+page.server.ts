import type {PageServerLoad} from "./$types";
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async ({locals}) => {
  // Check if user is authenticated - if not, redirect to login
  if (!locals.user) {
    throw redirect(302, "/login");
  }

  // If user is not suspended or blocked, redirect to dashboard
  if (!["suspended", "blocked"].includes(locals.user.status || "")) {
    throw redirect(302, "/dashboard");
  }

  return {
    user: locals.user,
  };
};
