"use client";

import { useGetMarketIndicesQuery } from "@/features/dashboard/dashboard.query";
import MarketTickerSkeleton from "@/features/dashboard/skeleton/MarketTickerSkeleton";
import { formatNumber } from "@/shared/utils/number";

export default function MarketTicker() {

  const { data: indices = [], isLoading } = useGetMarketIndicesQuery();

  // 조회중
  if (isLoading) return <MarketTickerSkeleton />

  // 미존재
  if (indices.length === 0) return null;

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-3 flex items-center gap-7 overflow-x-auto scrollbar-hide scroll-fade-mask">
        {indices.map((index) => (
          <div key={index.marketCode} className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
            <span className="text-sm font-medium text-gray-400">{index.marketName}</span>
            <span className="text-sm font-semibold text-gray-100">{formatNumber(index.indexValue)}</span>
            <span className={`text-sm font-medium tabular-nums ${index.changePercent >= 0 ? "text-red-400" : "text-sky-400"}`}>
              {index.changePercent >= 0 ? "▲" : "▼"} {Math.abs(index.changePercent)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}