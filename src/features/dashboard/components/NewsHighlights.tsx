"use client";

import Link from "next/link";
import { Newspaper, ChevronRight } from "lucide-react";
import { useNewsHighlightsQuery } from "@/features/dashboard/dashboard.query";
import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function NewsHighlights() {

  const { data: news, isLoading } = useNewsHighlightsQuery();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-100">주목할만한 뉴스</h2>
        <Link href="/news" className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
          더보기<ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="divide-y divide-gray-800/50">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="py-4 px-2 -mx-2">
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      ) : !news?.length ? (
        // 빈 상태
        <div className="p-10 text-center">
          <Newspaper className="w-10 h-10 text-gray-700 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-sm font-medium text-gray-400 mb-1">현재 수집된 뉴스가 없습니다.</p>
          <p className="text-xs text-gray-600">새로운 뉴스가 들어오면 알려드릴게요.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-800/50">
          {news.map((item) => (
            <div key={item.id} className="py-4 px-2 -mx-2 hover:bg-gray-900 rounded-xl transition-colors cursor-pointer">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs text-gray-400">{item.stockName}</span>
                <span className="text-xs text-gray-500 ml-auto">{item.publishedAt}</span>
              </div>
              <p className="text-sm font-medium text-gray-100 truncate mb-1.5">{item.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
