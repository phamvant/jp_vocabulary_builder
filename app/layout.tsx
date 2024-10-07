import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "./Provider";
import { Toaster } from "@/components/ui/toaster";
import { M_PLUS_Rounded_1c } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';

const m_plus = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400", "700"],
});


export const metadata: Metadata = {
  title: "漢字学び",
  description: "A Thuan's product",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  icons: [
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
        <body className={m_plus.className}>
          {/* <NextTopLoader /> */}
          {children}
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}
