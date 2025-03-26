import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {SubscriptionTypeService} from "$lib/services/core";

/**
 * Public endpoint for subscription types
 * This is a lightweight wrapper around the admin endpoint
 * that only returns active subscription types
 */
export const GET: RequestHandler = async () => {
  try {
    // Fetch only active subscription types using the service layer
    const types = await SubscriptionTypeService.getAll(true);

    // Return with cache headers to reduce load (same as admin endpoint)
    return json(
      {
        success: true,
        subscriptionTypes: types,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=300", // Cache for 5 minutes
          Expires: new Date(Date.now() + 300000).toUTCString(),
        },
      }
    );
  } catch (err) {
    console.error("Error fetching active subscription types:", err);
    return json(
      {
        success: false,
        message: "Failed to fetch subscription types",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      {status: 500}
    );
  }
};
