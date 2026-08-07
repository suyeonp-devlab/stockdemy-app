import React from "react";
import { News } from "@/features/news/news.type";
import { Newspaper } from "lucide-react";
import NewsCard from "@/features/news/components/NewsCard";
import Pagination from "@/shared/components/pagination/Pagination";
import NewsCardWrapSkeleton from "@/features/news/skeleton/NewsCardWrapSkeleton";

interface NewsCardWrapProps {
  isLoading: boolean;
  newsList: News[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function NewsCardWrap({
  isLoading,
  newsList,
  page,
  totalPages,
  onPageChange
}: NewsCardWrapProps) {

  const hasNews = newsList.length > 0;

  return (
    <div className="flex-1 min-w-0">
      {/* 조회중 */}
      {isLoading && <NewsCardWrapSkeleton />}

      {/* 미존재 */}
      {!isLoading && !hasNews && (
        <div className="p-10 text-center md:mt-16">
          <Newspaper strokeWidth={0.5} className="w-24 h-24 text-gray-600 mx-auto mb-3" />
          <p className="text-sm md:text-base font-medium text-gray-600">검색 조건에 해당하는 뉴스가 없습니다.</p>
        </div>
      )}

      {/* 존재 */}
      {!isLoading && hasNews && (
        <>
          <div className="divide-y divide-gray-800/50">
            {newsList.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </>
      )}
    </div>
  );
}