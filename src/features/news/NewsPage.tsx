"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useGetNewsListQuery } from "@/features/news/news.query";
import { useGetCommonCodesQuery } from "@/shared/common-code/common-code.query";
import { toFilterOptions } from "@/shared/utils/view";
import { useAuthStore } from "@/shared/store/auth.store";
import Input from "@/shared/components/form/Input";
import Pagination from "@/shared/components/pagination/Pagination";
import FilterTabs from "@/shared/components/tab/FilterTabs";
import SentimentCard from "@/features/news/components/SentimentCard";
import TopMentionsCard from "@/features/news/components/TopMentionsCard";
import NewsCard from "@/features/news/components/NewsCard";
import { NewsRequest } from "@/features/news/news.type";
import { useOverlay } from "@/system/overlay/useOverlay";
import { useRouter } from "next/navigation";
import IconButton from "@/shared/components/button/IconButton";
import NewsListSkeleton from "@/features/news/skeleton/NewsListSkeleton";

const PAGE_SIZE = 10;
const FAVORITE_TAB = "favorite";

export default function NewsPage() {

  const router = useRouter();
  const { confirm } = useOverlay();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // 뉴스 조회 조건
  const [searchQuery, setSearchQuery] = useState<NewsRequest>({
    category: "", stockName: "", favorite: false, page: 1, pageSize: PAGE_SIZE
  });

  // 종목명 검색어
  const [stockNameInput, setStockNameInput] = useState("");

  const { data: newsCategories } = useGetCommonCodesQuery({ groupId: "NEWS_CATEGORY" });
  const { data: newsResponse, isLoading } = useGetNewsListQuery(searchQuery);

  const news = newsResponse?.items ?? [];
  const categories = newsCategories?.items ?? [];

  const tabOptions = categories.length === 0 ? [] : [
    ...toFilterOptions(categories),
    { label: "내 관심종목", value: FAVORITE_TAB },
  ];

  // 뉴스 조회 조건 변경 (단일필드)
  const handleSearchChange = <K extends keyof NewsRequest>(key: K, value: NewsRequest[K]) => {
    setSearchQuery((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setSearchQuery((prev) => ({ ...prev, page }));
  };

  // 탭 변경
  const handleTabChange = async (tabValue: string) => {

    // [내 관심종목]은 로그인 사용자만 이용 가능
    if (tabValue === FAVORITE_TAB && !isLoggedIn) {
      const confirmed = await confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?");
      if (confirmed) router.push("/login");
      return;
    }

    const category = tabValue === FAVORITE_TAB ? "" : tabValue;
    const favorite = tabValue === FAVORITE_TAB;

    setSearchQuery((prev) => ({...prev, category, favorite, page: 1,}));
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-2">뉴스 & AI 분석</h1>
        <p className="text-sm text-gray-400">AI가 종목 관련 뉴스를 요약하고 시장 흐름을 분석해드려요.</p>
      </div>

      {/* 모바일: 시장 평가 + 많이 언급된 종목 */}
      <div className="md:hidden mb-6 space-y-4">
        <SentimentCard />
        <TopMentionsCard />
        <div className="flex-1 h-px bg-gray-800 mt-6" />
      </div>

      {/* 필터 */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <FilterTabs
          options={tabOptions}
          value={searchQuery.category}
          onChange={handleTabChange}
          className="-mx-6 px-6"
        />

        <div className="relative md:ml-auto">
          <Input
            type="text"
            placeholder="종목명으로 검색"
            value={stockNameInput}
            onChange={(e) => setStockNameInput(e.target.value)}
            className="pr-9 py-2 rounded-xl w-full md:w-64"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                handleSearchChange("stockName", stockNameInput.trim());
              }
            }}
          />
          <IconButton
            icon={<Search size={20} />}
            size="sm"
            aria-label="검색"
            onClick={() => handleSearchChange("stockName", stockNameInput.trim())}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>
      </div>

      {/* 뉴스 목록 */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 min-w-0">
          {isLoading && <NewsListSkeleton />}

          {/* 미존재 */}
          {!isLoading && news.length === 0 && (
            <div className="md:bg-gray-900 md:rounded-2xl md:border md:border-gray-800 p-10 text-center">
              <p className="text-sm md:text-base font-medium text-gray-400 mb-2">검색 조건에 해당하는 뉴스가 없습니다.</p>
              <p className="text-xs md:text-sm text-gray-600">카테고리나 종목명을 바꿔서 검색해 보세요.</p>
            </div>
          )}

          {/* 존재 */}
          {!isLoading && news.length > 0 && (
            <>
              <div className="divide-y divide-gray-800/50">
                {news.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>

              <Pagination
                page={searchQuery.page}
                totalPages={newsResponse?.totalPages ?? 1}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>

        {/* 데스크탑: 시장 평가 + 많이 언급된 종목 */}
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