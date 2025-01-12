import type {RequestEvent} from "@sveltejs/kit";

export interface AuthenticatedRequestEvent extends RequestEvent {
  locals: {
    auth: {
      userId: string;
    };
  };
}

export type AuthenticatedRequestHandler = (
  event: AuthenticatedRequestEvent
) => Promise<Response>;
