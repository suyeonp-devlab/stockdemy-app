import type { Metadata } from "next";
import { Suspense } from "react";
import StockPage from "@/features/stock/StockPage";

export const metadata: Metadata = { title: "종목" };

export default function StockRoutePage() {

  return (
    <Suspense fallback={null}>
      <StockPage />
    </Suspense>
  );
}
