export function formatDate(
  date: string | Date,
  includeTime: boolean = false,
): string {
  const d = new Date(date);

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
}

export function formatTimestamp(timestamp: number | string | Date): string {
  // If timestamp is a string that looks like a number, convert it
  if (typeof timestamp === "string" && !isNaN(Number(timestamp))) {
    timestamp = Number(timestamp);
  }

  // If timestamp is a number and appears to be in seconds (Unix timestamp), convert to milliseconds
  if (typeof timestamp === "number" && timestamp < 1e12) {
    timestamp = timestamp * 1000;
  }

  return formatDate(new Date(timestamp), true);
}

export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function addDaysToDate(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
