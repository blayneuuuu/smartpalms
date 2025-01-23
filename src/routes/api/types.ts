import type {RequestEvent, RequestHandler} from "@sveltejs/kit";
import type {User} from "$lib/server/db/schema";

export interface AuthenticatedRequestEvent {
  locals: {
    user: User;
  };
}

export type AuthenticatedRequestHandler = RequestHandler<{
  locals: {
    user: User;
  };
  params?: Record<string, string>;
}>;

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
