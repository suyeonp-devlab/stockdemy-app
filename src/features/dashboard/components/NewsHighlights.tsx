"use client";

import React from "react";
import Link from "next/link";
import { Newspaper, ChevronRight } from "lucide-react";
import { useGetNewsListQuery } from "@/features/news/news.query";
import NewsCardWrapSkeleton from "@/features/news/skeleton/NewsCardWrapSkeleton";
import NewsCard from "@/features/news/components/NewsCard";

const PAGE_SIZE = 5;

export default function NewsHighlights() {

  const { data: newsResponse, isLoading } = useGetNewsListQuery({
    category: "", keyword: "", favorite: false, page: 1, pageSize: PAGE_SIZE,
  });

  const newsList = newsResponse?.items ?? [];

  return (
    <div className="rounded-md border border-gray-800 p-6 pb-3.5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-100">주목할만한 뉴스</h2>
        {!isLoading && newsList.length > 0 && (
          <Link href="/news" className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
            더보기<ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* 조회중 */}
      {isLoading && <NewsCardWrapSkeleton size={5} showLogo={false} />}

      {/* 미존재 */}
      {!isLoading && newsList.length === 0 && (
        <div className="py-6 text-center">
          <Newspaper className="w-14 h-14 text-gray-700 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-sm font-medium text-gray-400 mb-1">현재 수집된 뉴스가 없습니다.</p>
        </div>
      )}

      {/* 존재 */}
      {!isLoading && newsList.length > 0 && (
        <div className="divide-y divide-gray-800/50">
          {newsList.map((news) => (
            <NewsCard key={news.id} news={news} showLogo={false} className="!py-3" />
          ))}
        </div>
      )}
    </div>
  );
}
