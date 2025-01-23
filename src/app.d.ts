// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
/// <reference types="svelte-clerk/env" />
/// <reference types="@sveltejs/kit" />

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user?: {
        id: string;
        email: string;
        name: string;
        type: "admin" | "user";
      };
    }
    interface PageData {
      user?: {
        id: string;
        email: string;
        name: string;
        type: "admin" | "user";
      };
    }
    // interface PageState {}
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Platform {}
  }
}

export {};
