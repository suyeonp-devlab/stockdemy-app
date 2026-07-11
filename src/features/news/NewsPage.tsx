"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Search } from "lucide-react";
import { useNewsListQuery } from "@/features/news/news.query";
import { useMeQuery } from "@/features/auth/auth.query";
import { NewsCategory } from "@/features/news/news.type";
import { AiSentiment } from "@/features/dashboard/dashboard.type";
import Input from "@/shared/components/form/Input";
import Skeleton from "@/shared/components/skeleton/Skeleton";
import SentimentCard from "@/features/news/components/SentimentCard";
import TopMentionsCard from "@/features/news/components/TopMentionsCard";

type CategoryFilter = "all" | NewsCategory | "watch";

const categoryFilters: { label: string; value: CategoryFilter }[] = [
  { label: "전체", value: "all" },
  { label: "국내", value: "국내" },
  { label: "해외", value: "해외" },
  { label: "내 관심종목", value: "watch" },
];

const sentimentBadgeStyle: Record<AiSentiment, string> = {
  긍정: "bg-red-950 text-red-300",
  중립: "bg-gray-800 text-gray-400",
  부정: "bg-sky-950 text-sky-300",
};

const PAGE_SIZE = 4;

export default function NewsPage() {

  const { data: news, isLoading } = useNewsListQuery();
  const { data: me } = useMeQuery();

  const [category, setCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const isWatchTab = category === "watch";

  const filteredNews = useMemo(() => {
    if (!news || isWatchTab) return [];
    const query = searchQuery.trim().toLowerCase();
    return news.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesQuery = !query || item.title.toLowerCase().includes(query) || item.stockName.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [news, category, isWatchTab, searchQuery]);

  const visibleNews = filteredNews.slice(0, visibleCount);

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-1">뉴스 & AI 분석</h1>
        <p className="text-sm text-gray-500">AI가 종목 관련 뉴스를 요약하고 시장 흐름을 분석해드려요.</p>
      </div>

      {/* 모바일: 시장 감성 + 많이 언급된 종목 (필터 위, 세로 배치) */}
      <div className="md:hidden mb-6 space-y-4">
        <SentimentCard />
        <TopMentionsCard />
      </div>

      {/* 필터 */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="flex gap-2 flex-nowrap overflow-x-auto pb-1">
          {categoryFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => { setCategory(filter.value); setVisibleCount(PAGE_SIZE); }}
              className={clsx(
                "px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors flex items-center gap-1",
                category === filter.value ? "bg-blue-500 text-white" : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white"
              )}
            >
              {filter.label}
              {filter.value === "watch" && !me && <span className="text-xs text-gray-600">(로그인 필요)</span>}
            </button>
          ))}
        </div>

        <div className="relative md:ml-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <Input
            type="text"
            placeholder="종목명으로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 py-2 rounded-xl w-full md:w-56"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">

        {/* 뉴스 목록 */}
        <div className="flex-1 min-w-0">
          {isWatchTab ? (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-10 text-center">
              <p className="text-sm font-medium text-gray-400 mb-1">내 관심 종목의 뉴스를 모아볼 수 있어요.</p>
              <p className="text-xs text-gray-600 mb-4">로그인 후 관심 종목을 등록해보세요.</p>
              <Link href="/login" className="inline-block px-4 py-2 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                로그인하기
              </Link>
            </div>
          ) : isLoading ? (
            <NewsListSkeleton />
          ) : visibleNews.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-10 text-center">
              <p className="text-sm font-medium text-gray-400 mb-1">해당하는 뉴스가 없습니다.</p>
              <p className="text-xs text-gray-600">다른 필터나 검색어로 찾아보세요.</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-800/50">
                {visibleNews.map((item) => (
                  <div key={item.id} className="py-5 px-3 -mx-3 hover:bg-gray-900/50 rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 flex-shrink-0">
                        {item.stockName.slice(0, 1)}
                      </div>
                      <span className="text-xs text-gray-400">{item.stockName}</span>
                      <span className="text-xs text-gray-600">·</span>
                      <span className="text-xs text-gray-600">{item.publishedAt}</span>
                      <span className={clsx("px-2 py-0.5 text-xs font-medium rounded-md ml-auto", sentimentBadgeStyle[item.sentiment])}>
                        {item.sentiment}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-100 mb-2 leading-relaxed">{item.title}</h3>
                    <div className="mb-2">
                      <div className="text-xs text-blue-400 font-medium mb-1">AI 요약</div>
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{item.summary}</p>
                    </div>
                  </div>
                ))}
              </div>

              {visibleCount < filteredNews.length && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    className="px-6 py-2.5 border border-gray-800 text-sm text-gray-400 rounded-xl hover:bg-gray-900 transition-colors"
                  >
                    더 불러오기
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 사이드 */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            <SentimentCard />
            <TopMentionsCard />
          </div>
        </div>

      </div>
    </div>
  );
}

// 뉴스 목록 로딩 스켈레톤
function NewsListSkeleton() {
  return (
    <div className="divide-y divide-gray-800/50">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="py-5 px-3 -mx-3">
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  );
}
