import React, { type PropsWithChildren } from "react";
import type { Metadata } from "next";
import "@/styles/globals.css";
import Providers from "@/app/Providers";

export const metadata: Metadata = {
  title: {
    default: "Stockdemy",
    template: "%s | Stockdemy",
  },
  description: "AI로 복기하는 나만의 주식 일지",
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
