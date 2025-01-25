import { e as error, j as json } from "../../../../../chunks/index.js";
import { d as db, l as lockers, c as accessHistory } from "../../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
class APIError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "APIError";
  }
}
function handleError(err) {
  console.error("API Error:", err);
  if (err instanceof APIError) {
    throw error(err.status, err.message);
  }
  if (err instanceof Error) {
    throw error(500, "Internal server error");
  }
  throw error(500, "An unexpected error occurred");
}
const APIErrors = {
  OTP: {
    REQUIRED: () => new APIError(400, "OTP is required", "OTP_REQUIRED"),
    INVALID: () => new APIError(404, "Invalid or expired OTP", "INVALID_OTP")
  },
  LOCKER: {
    NOT_FOUND: () => new APIError(404, "Locker not found", "LOCKER_NOT_FOUND"),
    INVALID_ID: () => new APIError(400, "Invalid locker ID", "INVALID_LOCKER_ID")
  },
  VALIDATION: {
    INVALID_REQUEST: (message) => new APIError(400, message, "INVALID_REQUEST")
  }
};
async function validateRequest(event, schema) {
  try {
    const body = await event.request.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      const { errors } = result.error;
      throw APIErrors.VALIDATION.INVALID_REQUEST(errors[0].message);
    }
    return result.data;
  } catch (err) {
    if (err instanceof Error && err.message === "Unexpected end of JSON input") {
      throw APIErrors.VALIDATION.INVALID_REQUEST("Request body is required");
    }
    throw err;
  }
}
const accessSchema = z.object({
  locker_id: z.string().min(1, "Locker ID is required")
});
const POST = async (event) => {
  try {
    const { locker_id } = await validateRequest(event, accessSchema);
    const [locker] = await db.select().from(lockers).where(eq(lockers.id, locker_id));
    if (!locker) {
      await db.insert(accessHistory).values({
        id: crypto.randomUUID(),
        lockerId: locker_id,
        accessType: "external",
        status: "failed"
      });
      throw APIErrors.LOCKER.NOT_FOUND();
    }
    await db.insert(accessHistory).values({
      id: crypto.randomUUID(),
      lockerId: locker_id,
      accessType: "external",
      status: "success"
    });
    await db.update(lockers).set({
      lastAccessedAt: /* @__PURE__ */ new Date()
    }).where(eq(lockers.id, locker_id));
    const response = {
      success: true,
      locker: {
        id: locker.id,
        number: locker.number
      }
    };
    return json(response);
  } catch (err) {
    return handleError(err);
  }
};
export {
  POST
};
