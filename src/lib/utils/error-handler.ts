import { json } from "@sveltejs/kit";

/**
 * Standard error codes for consistent error responses
 */
export enum ErrorCode {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
}

/**
 * Standardized error handler for API endpoints
 * @param error The error to handle
 * @returns A JSON response with standardized error format
 */
export function handleApiError(error: unknown): Response {
  console.error("API Error:", error);

  // Handle SvelteKit HttpError or similar errors with status code
  if (isErrorWithStatus(error)) {
    return json(
      {
        success: false,
        error: getErrorMessage(error) || "An error occurred",
      },
      { status: error.status },
    );
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    // Determine appropriate status code from error message or default to 500
    let status = ErrorCode.INTERNAL_SERVER_ERROR;

    if (error.message.includes("not found")) {
      status = ErrorCode.NOT_FOUND;
    } else if (
      error.message.includes("unauthorized") ||
      error.message.includes("not authorized")
    ) {
      status = ErrorCode.UNAUTHORIZED;
    } else if (error.message.includes("forbidden")) {
      status = ErrorCode.FORBIDDEN;
    } else if (
      error.message.includes("invalid") ||
      error.message.includes("required")
    ) {
      status = ErrorCode.BAD_REQUEST;
    } else if (
      error.message.includes("exists") ||
      error.message.includes("duplicate")
    ) {
      status = ErrorCode.CONFLICT;
    }

    return json(
      {
        success: false,
        error: error.message,
      },
      { status },
    );
  }

  // Handle unknown errors
  return json(
    {
      success: false,
      error: "An unexpected error occurred",
    },
    { status: ErrorCode.INTERNAL_SERVER_ERROR },
  );
}

/**
 * Type guard for errors with status property
 */
function isErrorWithStatus(
  error: unknown,
): error is { status: number; body?: unknown } {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status: unknown }).status === "number"
  );
}

/**
 * Extract error message from an error with body
 */
function getErrorMessage(error: { body?: unknown }): string {
  if (typeof error.body === "object" && error.body && error.body !== null) {
    if ("message" in error.body) {
      return String((error.body as { message: unknown }).message);
    }
  }
  return String(error.body || "");
}
