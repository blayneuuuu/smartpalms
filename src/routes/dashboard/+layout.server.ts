import type {LayoutServerLoad} from "./$types";
import {redirect} from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({locals, url}) => {
  // Check if user is authenticated
  if (!locals.user) {
    // User is not authenticated, redirect to login with return URL
    const returnUrl = encodeURIComponent(url.pathname + url.search);
    throw redirect(302, `/login?returnUrl=${returnUrl}`);
  }

  // For admin routes, check if user is an admin
  if (
    url.pathname.startsWith("/dashboard/admin") &&
    locals.user.type !== "admin"
  ) {
    // User is not an admin but trying to access admin routes
    throw redirect(302, "/dashboard");
  }

  // For user with blocked or suspended status
  if (["blocked", "suspended"].includes(locals.user.status || "")) {
    // Redirect to a special account status page
    throw redirect(302, "/account-status");
  }

  return {
    user: locals.user,
  };
};
