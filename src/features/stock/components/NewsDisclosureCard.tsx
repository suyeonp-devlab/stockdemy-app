"use client";

import Link from "next/link";
import React from "react";
import { useGetDisclosureListQuery } from "@/features/stock/stock.query";
import { useGetNewsListQuery } from "@/features/news/news.query";
import NewsDisclosureCardSkeleton from "@/features/stock/skeleton/NewsDisclosureCardSkeleton";
import DisclosureRow from "@/features/stock/components/DisclosureRow";
import { ChevronRight, Newspaper } from "lucide-react";
import NewsCard from "@/features/news/components/NewsCard";

interface NewsDisclosureCardProps {
  stockCode: string;
}

export default function NewsDisclosureCard({ stockCode }: NewsDisclosureCardProps) {

  const { data: disclosures = [], isLoading: isDisclosureLoading } = useGetDisclosureListQuery(stockCode);

  const { data: newsResponse, isLoading: isNewsLoading } = useGetNewsListQuery({
    category: "", keyword: stockCode, favorite: false, page: 1, pageSize: 5
  });

  const newsList = newsResponse?.items ?? [];

  if (isNewsLoading || isDisclosureLoading) return <NewsDisclosureCardSkeleton />

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* 관련 뉴스 */}
      <div className="md:flex-1 min-w-0">
        <div className="flex justify-between mb-4 pl-1 pr-px">
          <h3 className="text-sm md:text-base font-semibold text-gray-100">관련 뉴스</h3>
          {newsList.length > 0 && (
            <Link href={`/news?initC=${stockCode}&initN=${newsList[0].stockName}`} className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
              더보기<ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="bg-gray-900 rounded-md p-4 pt-1">
          {newsList.length === 0 && (
            <div className="p-10 text-center">
              <Newspaper strokeWidth={0.5} className="w-24 h-24 text-gray-600 mx-auto mb-3" />
              <p className="text-sm md:text-base font-medium text-gray-600">관련 뉴스가 없습니다.</p>
            </div>
          )}

          {newsList.length > 0 && (
            <div className="divide-y divide-gray-700/50">
              {newsList.map((news) => (
                <NewsCard key={news.id} news={news} showLogo={false} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 관련 공시 */}
      <div className="md:w-90 flex-shrink-0">
        <div className="md:sticky md:top-32 space-y-4">
          <h3 className="text-sm md:text-base font-semibold text-gray-100 mb-4 pl-1">관련 공시</h3>

          <div className="bg-gray-900 rounded-md p-4">
            {disclosures.length === 0 && (
              <div className="p-10 text-center">
                <Newspaper strokeWidth={0.5} className="w-24 h-24 text-gray-600 mx-auto mb-3" />
                <p className="text-sm md:text-base font-medium text-gray-600">관련 공시가 없습니다.</p>
              </div>
            )}

            {disclosures.length > 0 && (
              <div className="space-y-4">
                {disclosures.map((disclosure) => (
                  <DisclosureRow key={disclosure.receiptNo} disclosure={disclosure} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
