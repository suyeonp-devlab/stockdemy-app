"use client";

import { useMarketIndicesQuery } from "@/features/dashboard/dashboard.query";
import { MarketIndex } from "@/features/dashboard/dashboard.type";
import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function MarketTicker() {

  const { data: indices, isLoading } = useMarketIndicesQuery();

  if (isLoading) {
    return (
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-3 flex items-center gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!indices?.length) return null;

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-3 flex items-center gap-6 overflow-x-auto">
        {indices.map((index) => <IndexItem key={index.code} index={index} />)}
      </div>
    </div>
  );
}

// 지수 한 항목
function IndexItem({ index }: { index: MarketIndex }) {
  const isUp = index.changePercent >= 0;
  return (
    <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
      <span className="text-sm font-medium text-gray-400">{index.name}</span>
      <span className="text-sm font-semibold text-gray-100">{index.value.toLocaleString()}</span>
      <span className={`text-xs font-medium tabular-nums ${isUp ? "text-red-400" : "text-sky-400"}`}>
        {isUp ? "▲" : "▼"} {Math.abs(index.changePercent).toFixed(2)}%
      </span>
    </div>
  );
}
