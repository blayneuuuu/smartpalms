// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
/// <reference types="svelte-clerk/env" />
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      auth: import("svelte-clerk/server").Auth;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
