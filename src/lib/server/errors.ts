import {error} from "@sveltejs/kit";
import type {ErrorResponse} from "$lib/types/api";

export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

export function handleError(err: unknown): never {
  console.error("API Error:", err);

  if (err instanceof APIError) {
    throw error(err.status, err.message);
  }

  if (err instanceof Error) {
    throw error(500, "Internal server error");
  }

  throw error(500, "An unexpected error occurred");
}

// Common API Errors
export const APIErrors = {
  OTP: {
    REQUIRED: () => new APIError(400, "OTP is required", "OTP_REQUIRED"),
    INVALID: () => new APIError(404, "Invalid or expired OTP", "INVALID_OTP"),
  },
  LOCKER: {
    NOT_FOUND: () => new APIError(404, "Locker not found", "LOCKER_NOT_FOUND"),
    INVALID_ID: () =>
      new APIError(400, "Invalid locker ID", "INVALID_LOCKER_ID"),
  },
  VALIDATION: {
    INVALID_REQUEST: (message: string) =>
      new APIError(400, message, "INVALID_REQUEST"),
  },
} as const;

// Helper to format error response
export function formatErrorResponse(message: string): ErrorResponse {
  return {
    success: false,
    message,
  };
}
