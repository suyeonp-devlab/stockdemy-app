"use client";

import { useGetSentimentSummaryQuery } from "@/features/news/news.query";
import SentimentCardSkeleton from "@/features/news/skeleton/SentimentCardSkeleton";
import { formatNumber } from "@/shared/utils/number";

export default function SentimentCard() {

  const { data: summary, isLoading } = useGetSentimentSummaryQuery();

  // 조회중
  if (isLoading) return <SentimentCardSkeleton />

  const bars = [
    { label: "긍정", value: summary?.positive ?? 0, colorClass: "bg-red-400", textClass: "text-red-400" },
    { label: "중립", value: summary?.neutral ?? 0, colorClass: "bg-gray-500", textClass: "text-gray-400" },
    { label: "부정", value: summary?.negative ?? 0, colorClass: "bg-sky-400", textClass: "text-sky-400" },
  ];

  return (
    <div className="bg-gray-900 rounded-md md:border md:border-gray-800 pt-3 md:p-5">
      <h3 className="hidden md:block text-sm font-semibold text-gray-100 mb-4">오늘의 시장 평가</h3>

      <div className="space-y-3">
        {bars.map((bar) => (
          <div key={bar.label} className="flex items-center gap-2">
            <span className="text-xs text-gray-300 w-8 flex-shrink-0">{bar.label}</span>
            <div className="flex-1 min-w-0 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full ${bar.colorClass} rounded-full`} style={{ width: `${bar.value}%` }} />
            </div>
            <span className={`text-xs font-medium w-9 flex-shrink-0 text-right ${bar.textClass}`}>{bar.value}%</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-600 mt-4">오늘 수집된 뉴스 {formatNumber(summary?.totalCount ?? 0)}건 기준</p>
    </div>
  );
}
