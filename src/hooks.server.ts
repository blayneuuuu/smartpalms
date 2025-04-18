// src/hooks.server.ts
import type {Handle} from "@sveltejs/kit";
import {db} from "$lib/server/db";
import {users} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";
import {SubscriptionService} from "$lib/services/core/subscription.service";
import {UserService} from "$lib/services/core/user.service";
import {redirect} from "@sveltejs/kit";

// Simple in-memory cache to rate-limit expiration checks
// In a production environment, this should be replaced with a proper cache (Redis, etc.)
const expirationCheckCache = new Map<string, number>();
const EXPIRATION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Session activity tracking
const userLastActivity = new Map<string, number>();
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
const SESSION_REFRESH_THRESHOLD = 7 * 60 * 60 * 1000; // 7 hours - refresh session if almost expired

// Protected routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/settings", "/lockers"];

// Check if a route requires authentication
function isProtectedRoute(path: string): boolean {
  return PROTECTED_ROUTES.some((route) => path.startsWith(route));
}

export const handle: Handle = async ({event, resolve}) => {
  const {url} = event;
  const path = url.pathname;

  // Process session before resolving the response
  const isVerificationEndpoint = path === "/verify-email";
  const session = event.cookies.get("session");

  // Flag to track if session expired during this request
  let sessionExpired = false;

  // Handle normal session management for active sessions
  if (session) {
    // Session timeout check
    const now = Date.now();
    const lastActivity = userLastActivity.get(session);

    if (lastActivity && now - lastActivity > SESSION_TIMEOUT) {
      // Session has timed out due to inactivity
      console.log(
        `Session timeout for user ${session}, last activity: ${new Date(lastActivity).toISOString()}`
      );
      event.cookies.delete("session", {path: "/"});
      sessionExpired = true;
    } else {
      // Update last activity timestamp
      userLastActivity.set(session, now);

      // Check if session cookie needs to be refreshed (approaching expiry)
      const lastRefresh = lastActivity || 0;
      if (now - lastRefresh > SESSION_REFRESH_THRESHOLD) {
        // Refresh the session cookie with a new expiry time
        event.cookies.set("session", session, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 8, // 8 hours session timeout
        });
      }

      const user = await db.query.users.findFirst({
        where: eq(users.id, session),
        columns: {
          id: true,
          email: true,
          name: true,
          type: true,
          status: true,
        },
      });

      if (user) {
        event.locals.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          type: user.type,
          status: user.status,
        };

        // Check for expired subscriptions and OTPs when a user is logged in
        // Only check once every EXPIRATION_CHECK_INTERVAL per user
        const lastCheckTime = expirationCheckCache.get(user.id) || 0;

        if (now - lastCheckTime > EXPIRATION_CHECK_INTERVAL) {
          try {
            // Set the cache now to avoid concurrent checks
            expirationCheckCache.set(user.id, now);

            // Check and update expired subscriptions for this user
            const expiredSubCount =
              await SubscriptionService.checkAndUpdateExpiredSubscriptions(
                user.id
              );
            if (expiredSubCount > 0) {
              console.log(
                `Updated ${expiredSubCount} expired subscriptions for user ${user.id}`
              );

              // Update user status after subscription changes
              await UserService.updateUserStatusBasedOnSubscriptions(user.id);
            }

            // Clear expired OTPs
            const expiredOTPCount =
              await SubscriptionService.checkAndRemoveExpiredOTPs();
            if (expiredOTPCount > 0) {
              console.log(`Cleared ${expiredOTPCount} OTPs`);
            }
          } catch (error) {
            console.error("Error checking expirations:", error);
            // Continue with the request even if there was an error checking expirations
          }
        }
      } else {
        // Invalid session - user not found
        event.cookies.delete("session", {path: "/"});
        sessionExpired = true;
      }
    }
  } else if (!isVerificationEndpoint && isProtectedRoute(path)) {
    // Handle unauthenticated access to protected routes right here
    // This is a belt-and-suspenders approach to complement the layout.server.ts checks
    const returnUrl = encodeURIComponent(url.pathname + url.search);
    throw redirect(
      302,
      `/login?returnUrl=${returnUrl}&expired=${sessionExpired ? "1" : "0"}`
    );
  }

  // Now resolve the response
  const response = await resolve(event);

  // Add security headers to all HTML responses
  if (response.headers.get("content-type")?.includes("text/html")) {
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");

    if (process.env.NODE_ENV === "production") {
      response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
      );
    }
  }

  // Handle CORS for external API endpoints
  if (
    event.url.pathname.startsWith("/api/access/authenticated") ||
    event.url.pathname.startsWith("/api/access/direct") ||
    // Keep old paths temporarily for backward compatibility
    event.url.pathname.startsWith("/api/lockers/external") ||
    event.url.pathname.startsWith("/api/access/external")
  ) {
    if (event.request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return response;
};
