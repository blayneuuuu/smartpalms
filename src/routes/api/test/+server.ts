import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { dev } from "$app/environment";

export const GET: RequestHandler = async () => {
  return json({
    success: true,
    app: "SmartPalms API",
    version: "1.0.0",
    environment: dev ? "development" : "production",
    timestamp: new Date().toISOString(),
    status: "online",
  });
};
