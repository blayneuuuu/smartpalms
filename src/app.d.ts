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
        status?: string;
      };
    }
    interface PageData {
      user?: {
        id: string;
        email: string;
        name: string;
        type: "admin" | "user";
        status?: string;
      };
    }
    // interface PageState {}
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Platform {}
  }
}

// HTML2PDF declaration
declare module "html2pdf.js" {
  export default function (element?: HTMLElement): Html2PdfWrapper;

  interface Html2PdfWrapper {
    from(element: HTMLElement): Html2PdfWrapper;
    set(options: Html2PdfOptions): Html2PdfWrapper;
    save(): Promise<void>;
  }

  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: "portrait" | "landscape";
    };
  }
}

export {};
