import type { RequestEvent } from "@sveltejs/kit";
import { ZodSchema } from "zod";
import { APIErrors } from "./errors";

export async function validateRequest<T>(
  event: RequestEvent,
  schema: ZodSchema<T>,
): Promise<T> {
  try {
    const body = await event.request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const { errors } = result.error;
      throw APIErrors.VALIDATION.INVALID_REQUEST(errors[0].message);
    }

    return result.data;
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === "Unexpected end of JSON input"
    ) {
      throw APIErrors.VALIDATION.INVALID_REQUEST("Request body is required");
    }
    throw err;
  }
}
