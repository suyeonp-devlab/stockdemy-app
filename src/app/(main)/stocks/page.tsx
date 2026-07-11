import { Suspense } from "react";
import StockSearchPage from "@/features/stocks/StockSearchPage";

export default function StocksPage() {
  return (
    <Suspense>
      <StockSearchPage />
    </Suspense>
  );
}
