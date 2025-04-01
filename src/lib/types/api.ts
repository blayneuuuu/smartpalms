import type { RequestEvent } from "@sveltejs/kit";

// Base API request type
export type APIRequest = RequestEvent<
  Partial<Record<string, string>>,
  string | null
>;

// OTP Access Response
export interface OTPAccessResponse {
  success: boolean;
  locker?: {
    id: string;
    number: string;
  };
  message?: string;
}

// External Access Response
export interface ExternalAccessResponse {
  success: boolean;
  locker?: {
    id: string;
    number: string;
  };
  message?: string;
}

// Error Response
export interface ErrorResponse {
  success: false;
  message: string;
}
