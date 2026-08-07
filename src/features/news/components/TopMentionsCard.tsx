"use client";

import { useGetTopMentionsQuery } from "@/features/news/news.query";
import TopMentionsCardSkeleton from "@/features/news/skeleton/TopMentionsCardSkeleton";
import TopMentionsRow from "@/features/news/components/TopMentionsRow";

interface TopMentionsCardProps {
  onStockClick: (stockCode: string, stockName: string) => void;
}

export default function TopMentionsCard({ onStockClick }: TopMentionsCardProps) {

  const { data: mentions = [], isLoading } = useGetTopMentionsQuery();

  // 조회중
  if (isLoading) return <TopMentionsCardSkeleton />

  return (
    <div className="bg-gray-900 rounded-md border border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-gray-100 mb-4">많이 언급된 종목</h3>

      {mentions.length === 0 && (
        <p className="text-sm text-gray-500">많이 언급된 종목이 없습니다.</p>
      )}

      {mentions.length > 0 && (
        <>
          {/* 데스크탑: 세로 리스트 */}
          <div className="hidden md:block space-y-3">
            {mentions.map((mention, index) => (
              <TopMentionsRow key={`mention_${index}`} mention={mention} onStockClick={onStockClick} />
            ))}
          </div>

          {/* 모바일: 2x2 그리드 */}
          <div className="md:hidden grid grid-cols-2 gap-3">
            {mentions.map((mention, index) => (
              <TopMentionsRow key={`mention_${index}`} mention={mention} onStockClick={onStockClick} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
