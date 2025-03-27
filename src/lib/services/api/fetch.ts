type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
};

/**
 * A wrapper around the fetch API with error handling and automatic JSON parsing
 * @param url The URL to fetch from
 * @param options Request options
 * @returns A promise with the response data or error
 */
export async function apiFetch<T>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {method = "GET", body, headers = {}, credentials = "include"} = options;

  // Default headers
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  try {
    const response = await fetch(url, {
      method,
      headers: defaultHeaders,
      credentials,
      body: body ? JSON.stringify(body) : undefined,
    });

    const statusCode = response.status;

    // Try to parse JSON regardless of status code
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      // If response is not JSON, use text or empty object
      data = (await response.text()) || {};
    }

    // Handle success responses
    if (response.ok) {
      return {
        success: true,
        data: data as T,
        statusCode,
      };
    }

    // Handle error responses
    return {
      success: false,
      error:
        typeof data === "object" && data !== null && "message" in data
          ? String(data.message)
          : "An error occurred",
      statusCode,
      data: data as T,
    };
  } catch (error) {
    // Handle network errors
    console.error("Network error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
      statusCode: 0,
    };
  }
}

/**
 * GET request helper
 */
export function apiGet<T>(
  url: string,
  options: Omit<RequestOptions, "method"> = {}
) {
  return apiFetch<T>(url, {...options, method: "GET"});
}

/**
 * POST request helper
 */
export function apiPost<T>(
  url: string,
  body: unknown,
  options: Omit<RequestOptions, "method" | "body"> = {}
) {
  return apiFetch<T>(url, {...options, method: "POST", body});
}

/**
 * PUT request helper
 */
export function apiPut<T>(
  url: string,
  body: unknown,
  options: Omit<RequestOptions, "method" | "body"> = {}
) {
  return apiFetch<T>(url, {...options, method: "PUT", body});
}

/**
 * PATCH request helper
 */
export function apiPatch<T>(
  url: string,
  body: unknown,
  options: Omit<RequestOptions, "method" | "body"> = {}
) {
  return apiFetch<T>(url, {...options, method: "PATCH", body});
}

/**
 * DELETE request helper
 */
export function apiDelete<T>(
  url: string,
  options: Omit<RequestOptions, "method"> = {}
) {
  return apiFetch<T>(url, {...options, method: "DELETE"});
}
