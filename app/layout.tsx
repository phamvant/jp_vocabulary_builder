import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "./Provider";
import { Toaster } from "@/components/ui/toaster";
import { Zen_Maru_Gothic } from "next/font/google";
import { M_PLUS_Rounded_1c } from "next/font/google";
import { Html, Main, Head } from "next/document";

// const courier = Zen_Maru_Gothic({ subsets: ["latin"], weight: ["400", "700"] });
// const m_plus = M_PLUS_Rounded_1c({
//   subsets: ["latin"],
//   weight: ["400", "700"],
// });
// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "漢字学び",
  description: "A Thuan's product",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  // viewport:
  //   "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "dictionary-icon", url: "/icon-128.png" },
    { rel: "icon", url: "/icon-128.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-512.png"></link>
      </head>
      <SessionProvider>
        <body >
          <main>{children}</main>
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}
