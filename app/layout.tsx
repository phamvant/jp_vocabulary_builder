import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "./Provider";
import { Toaster } from "@/components/ui/toaster";
import { Zen_Maru_Gothic } from "next/font/google";
import { M_PLUS_Rounded_1c } from "next/font/google";

const courier = Zen_Maru_Gothic({ subsets: ["latin"], weight: ["400", "700"] });
const m_plus = M_PLUS_Rounded_1c({ subsets: ["latin"], weight: ["400", "700"] });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "漢字学び",
  description: "A Thuan's product",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className={m_plus.className}>
          <main>{children}</main>
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}
