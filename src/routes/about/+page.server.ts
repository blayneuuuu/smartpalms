import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  // If the user is already logged in, redirect to dashboard
  if (locals.user) {
    throw redirect(303, "/dashboard");
  }

  return {};
};
