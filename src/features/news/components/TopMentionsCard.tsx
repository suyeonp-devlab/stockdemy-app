"use client";

import { useGetTopMentionsQuery } from "@/features/news/news.query";
import Skeleton from "@/shared/components/skeleton/Skeleton";

// 로고 배경색 팔레트
const logoColors = [
  "bg-blue-800 text-blue-200",
  "bg-orange-800 text-orange-200",
  "bg-purple-800 text-purple-200",
  "bg-yellow-800 text-yellow-200",
  "bg-green-800 text-green-200",
];

// 모바일에서 보여줄 최대 개수
const MOBILE_MAX_COUNT = 4;

export default function TopMentionsCard() {

  const { data: mentions, isLoading } = useGetTopMentionsQuery();

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
        <Skeleton className="h-4 w-28 mb-4" />

        {/* 데스크탑: 세로 리스트 */}
        <div className="hidden md:block space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
        </div>

        {/* 모바일: 2x2 그리드 */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
        </div>
      </div>
    );
  }

  if (!mentions?.length) return null;

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-gray-100 mb-4">많이 언급된 종목</h3>

      {/* 데스크탑: 세로 리스트 */}
      <div className="hidden md:block space-y-3">
        {mentions.map((mention, index) => (
          <MentionRow key={mention.stockName} stockName={mention.stockName} count={mention.count} colorClass={logoColors[index % logoColors.length]} />
        ))}
      </div>

      {/* 모바일: 2x2 그리드 (최대 4개) */}
      <div className="md:hidden grid grid-cols-2 gap-3">
        {mentions.slice(0, MOBILE_MAX_COUNT).map((mention, index) => (
          <MentionRow key={mention.stockName} stockName={mention.stockName} count={mention.count} colorClass={logoColors[index % logoColors.length]} />
        ))}
      </div>
    </div>
  );
}

// 언급 순위 한 줄
function MentionRow({ stockName, count, colorClass }: { stockName: string; count: number; colorClass: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${colorClass}`}>
          {stockName.slice(0, 1)}
        </div>
        <span className="text-xs text-gray-300 truncate">{stockName}</span>
      </div>
      <span className="text-xs text-gray-500 flex-shrink-0">{count}건</span>
    </div>
  );
}
