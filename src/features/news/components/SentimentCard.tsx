"use client";

import { useSentimentSummaryQuery } from "@/features/news/news.query";
import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function SentimentCard() {

  const { data: summary, isLoading } = useSentimentSummaryQuery();

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
        <Skeleton className="h-4 w-28 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-3 w-full" />)}
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const bars = [
    { label: "긍정", value: summary.positive, colorClass: "bg-red-400", textClass: "text-red-400" },
    { label: "중립", value: summary.neutral, colorClass: "bg-gray-500", textClass: "text-gray-400" },
    { label: "부정", value: summary.negative, colorClass: "bg-sky-400", textClass: "text-sky-400" },
  ];

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-gray-100 mb-4">오늘의 시장 감성</h3>
      <div className="space-y-3">
        {bars.map((bar) => (
          <div key={bar.label} className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-8 flex-shrink-0">{bar.label}</span>
            <div className="flex-1 min-w-0 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full ${bar.colorClass} rounded-full`} style={{ width: `${bar.value}%` }} />
            </div>
            <span className={`text-xs font-medium w-9 flex-shrink-0 text-right ${bar.textClass}`}>{bar.value}%</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-600 mt-4">오늘 수집된 뉴스 {summary.totalCount}건 기준</p>
    </div>
  );
}
