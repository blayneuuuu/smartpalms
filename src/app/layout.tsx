import "./globals.css";
import {Inter} from "next/font/google";
import {Navigation} from "@/components/Navigation";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "Smart Palms",
  description: "Locker rental system",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
