// src/hooks.server.ts
import type { Handle } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { SubscriptionService } from "$lib/services/core/subscription.service";

// Simple in-memory cache to rate-limit expiration checks
// In a production environment, this should be replaced with a proper cache (Redis, etc.)
const expirationCheckCache = new Map<string, number>();
const EXPIRATION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const handle: Handle = async ({ event, resolve }) => {
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

    const response = await resolve(event);
    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  // Handle session for other routes
  const session = event.cookies.get("session");

  if (!session) {
    return await resolve(event);
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session),
    columns: {
      id: true,
      email: true,
      name: true,
      type: true,
    },
  });

  if (user) {
    event.locals.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.type,
    };

    // Check for expired subscriptions and OTPs when a user is logged in
    // Only check once every EXPIRATION_CHECK_INTERVAL per user
    const now = Date.now();
    const lastCheckTime = expirationCheckCache.get(user.id) || 0;

    if (now - lastCheckTime > EXPIRATION_CHECK_INTERVAL) {
      try {
        // Set the cache now to avoid concurrent checks
        expirationCheckCache.set(user.id, now);

        // Check and update expired subscriptions for this user
        const expiredSubCount =
          await SubscriptionService.checkAndUpdateExpiredSubscriptions(user.id);
        if (expiredSubCount > 0) {
          console.log(
            `Updated ${expiredSubCount} expired subscriptions for user ${user.id}`,
          );
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
  }

  return await resolve(event);
};
