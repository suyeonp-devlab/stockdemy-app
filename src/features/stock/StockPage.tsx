"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HelpCircle, Search } from "lucide-react";
import { useGetStockListQuery } from "@/features/stock/stock.query";
import { StockRequest, StockURLSearchParams, TabMode } from "@/features/stock/stock.type";
import { useGetCommonCodesQuery } from "@/shared/common-code/common-code.query";
import { toFilterOptions } from "@/shared/utils/view";
import Input from "@/shared/components/form/Input";
import { buildLoginUrl } from "@/features/auth/auth.lib";
import { useOverlay } from "@/system/overlay/useOverlay";
import { useAuthStore } from "@/shared/store/auth.store";
import { buildStockSearchParams, formatStockSearchParams, isTabMode } from "@/features/stock/stock.lib";
import FilterTabs, { FilterTabOption } from "@/shared/components/tab/FilterTabs";
import IconButton from "@/shared/components/button/IconButton";
import DisclosureCard from "@/features/stock/components/DisclosureCard";
import StockCardWrap from "@/features/stock/components/StockCardWrap";
import SubFilterSkeleton from "@/features/stock/skeleton/SubFilterSkeleton";

const PAGE_SIZE = 15;

export default function StockPage() {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { confirm, openPopup } = useOverlay();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // url 쿼리 스트링
  const params: StockURLSearchParams = Object.fromEntries(searchParams.entries());
  let tab = isTabMode(params.tab) ? params.tab : "topVolume";
  if (tab === "favorite" && !isLoggedIn) tab = "topVolume";

  // 종목 조회 조건
  const searchQuery: StockRequest = formatStockSearchParams(params, PAGE_SIZE);

  // 조회 조건 변경 → 스크롤 최상단 이동
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [searchQuery]);

  // 종목명 검색어
  const [keywordInput, setKeywordInput] = useState("");

  const { data: stockSectors, isLoading: isSectorsLoading } = useGetCommonCodesQuery({ groupId: "STOCK_SECTOR" });
  const { data: stockMarkets, isLoading: isMarketsLoading } = useGetCommonCodesQuery({ groupId: "STOCK_MARKET" });
  const { data: stockResponse, isLoading } = useGetStockListQuery(searchQuery);

  const stockList =  stockResponse?.items ?? [];
  const markets = stockMarkets?.items ?? [];
  const sectors = stockSectors?.items ?? [];

  // 시장 필터 옵션
  const marketOptions = toFilterOptions(markets);

  // 업종 필터 옵션
  const sectorOptions = toFilterOptions(sectors);

  // 종목 조회 조건 변경 (단일필드)
  const handleSearchChange = <K extends keyof StockURLSearchParams>(key: K, value: StockURLSearchParams[K]) => {
    const next: StockURLSearchParams = { ...params, [key]: value, page: "1" };
    router.replace(`${pathname}?${buildStockSearchParams(next)}`);
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    const next: StockURLSearchParams = { ...params, page: String(page) };
    router.replace(`${pathname}?${buildStockSearchParams(next)}`);
  };

  // 탭 변경
  const handleTabChange = async (mode: TabMode) => {

    // [내 관심종목]은 로그인 사용자만 이용 가능
    if (mode === "favorite" && !isLoggedIn) {
      const confirmed = await confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?");
      if (confirmed) router.push(buildLoginUrl(pathname));
      return;
    }

    handleSearchChange("tab", mode);
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-100">종목 검색</h1>

          {/* 모바일: 오늘의 공시 */}
          <button
            onClick={() => openPopup("오늘의 공시", <DisclosureCard />)}
            className="md:hidden inline-flex items-center self-baseline-last leading-loose gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            <HelpCircle size={16} />
            오늘의 공시
          </button>
        </div>

        <p className="text-sm text-gray-400">종목명 또는 티커로 원하는 종목을 검색해보세요.</p>
      </div>

      {/* 최상위 탭 */}
      <div className="mb-2">
        <FilterTabs
          options={tabOptions}
          value={tab}
          onChange={(value) => handleTabChange(value as TabMode)}
          className="-mx-6 px-6"
        />
      </div>

      <div className="flex flex-col md:flex-row md:justify-between gap-3 mb-8">
        <div className="flex-grow-1">
          {/* 시장별 서브탭 */}
          {tab === "market" && (
            isMarketsLoading ?
            <SubFilterSkeleton /> :
            <FilterTabs
              options={marketOptions}
              value={params.market ?? ""}
              onChange={(value) => handleSearchChange("market", value)}
              variant="sub"
              className="-mx-6 px-6 md:flex-wrap md:h-full"
            />
          )}

          {/* 업종별 서브탭 */}
          {tab === "sector" && (
            isSectorsLoading ?
            <SubFilterSkeleton /> :
            <FilterTabs
              options={sectorOptions}
              value={params.sector ?? ""}
              onChange={(value) => handleSearchChange("sector", value)}
              variant="sub"
              className="-mx-6 px-6 md:flex-wrap md:h-full"
            />
          )}
        </div>

        {/* 검색어 */}
        <div className="relative flex-shrink-0">
          <Input
            type="text"
            placeholder="종목명 또는 티커로 검색"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            className="pr-9 py-2 w-full md:w-90"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                handleSearchChange("keyword", keywordInput.trim());
              }
            }}
          />
          <IconButton
            icon={<Search size={20} />}
            size="sm"
            aria-label="검색"
            onClick={() => handleSearchChange("keyword", keywordInput.trim())}
            className="absolute top-2.5 right-3 text-gray-500"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* 종목 목록 */}
        <StockCardWrap
          isLoading={isLoading}
          stockList={stockList}
          tab={tab}
          page={searchQuery.page}
          totalPages={stockResponse?.totalPages ?? 1}
          onPageChange={handlePageChange}
        />

        {/* 데스크탑: 오늘의 공시 */}
        <div className="hidden md:block w-90 flex-shrink-0">
          <div className="sticky top-32 space-y-4">
            <DisclosureCard />
          </div>
        </div>
      </div>
    </div>
  );
}

// 탭 필터 옵션
const tabOptions: FilterTabOption[] = [
  { label: "거래량 상위", value: "topVolume"},
  { label: "시장별", value: "market"},
  { label: "업종별", value: "sector"},
  { label: "내 관심종목", value: "favorite"},
];
