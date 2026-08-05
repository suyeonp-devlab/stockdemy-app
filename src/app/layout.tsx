import React, { type PropsWithChildren } from "react";
import type { Metadata } from "next";
import "@/styles/globals.css";
import Providers from "@/app/Providers";

const description = "AI로 복기하는 나만의 주식 일지";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: { default: "Stockdemy", template: "%s | Stockdemy" },
  description,
  openGraph: {
    title: "Stockdemy",
    description,
    images: ["/images/og-image.png"],
    type: "website",
    locale: "ko_KR",
    siteName: "Stockdemy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stockdemy",
    description,
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {

  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
