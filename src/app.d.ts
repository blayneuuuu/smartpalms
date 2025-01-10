// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session?: any;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
