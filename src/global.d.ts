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
