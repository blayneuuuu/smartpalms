// src/hooks.server.ts
import { withClerkHandler } from "svelte-clerk/server";

export const handle = withClerkHandler({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});
