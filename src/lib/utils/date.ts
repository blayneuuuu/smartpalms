export function formatDate(
  date: string | Date | null | undefined,
  includeTime: boolean = false
): string {
  if (date === null || date === undefined) {
    return "N/A";
  }

  try {
    const d = new Date(date);

    // Check if date is valid
    if (isNaN(d.getTime())) {
      return "Invalid Date";
    }

    // Basic date formatting
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    // Add time options if requested
    if (includeTime) {
      dateOptions.hour = "2-digit";
      dateOptions.minute = "2-digit";
      dateOptions.hour12 = true;
    }

    return d.toLocaleString("en-US", dateOptions);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error formatting date";
  }
}

export function formatTimestamp(
  timestamp: number | string | Date | null | undefined
): string {
  if (timestamp === null || timestamp === undefined) {
    return "N/A";
  }

  try {
    // If timestamp is a string that looks like a number, convert it
    if (typeof timestamp === "string" && !isNaN(Number(timestamp))) {
      timestamp = Number(timestamp);
    }

    // If timestamp is a number and appears to be in seconds (Unix timestamp), convert to milliseconds
    if (typeof timestamp === "number" && timestamp < 1e12) {
      timestamp = timestamp * 1000;
    }

    // Create date object and verify it's valid
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return formatDate(date, true);
  } catch (error) {
    console.error(
      "Error formatting timestamp:",
      error,
      "Timestamp value:",
      timestamp
    );
    return "Error formatting date";
  }
}

export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function addDaysToDate(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Safe version of formatTimestamp for direct use in components
export function safeFormatTimestamp(timestamp: any): string {
  if (!timestamp) return "N/A";

  try {
    // For numeric timestamps (Unix seconds)
    if (typeof timestamp === "number") {
      return formatTimestamp(timestamp);
    }

    // For ISO strings or other string formats
    if (typeof timestamp === "string") {
      return formatTimestamp(timestamp);
    }

    // For Date objects
    if (timestamp instanceof Date) {
      return formatTimestamp(timestamp);
    }

    return "Invalid Date";
  } catch (error) {
    console.error("Error in safeFormatTimestamp:", error);
    return "Invalid Date";
  }
}
