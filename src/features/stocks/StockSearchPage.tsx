"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { ChevronDown, FileText, Search, Sparkles, Star } from "lucide-react";
import { useDisclosuresQuery, useStockListQuery } from "@/features/stocks/stocks.query";
import { useSectorSummariesQuery } from "@/features/dashboard/dashboard.query";
import { useGetMeQuery } from "@/features/auth/auth.query";
import { AiSentiment } from "@/features/dashboard/dashboard.type";
import { Market } from "@/features/stocks/stocks.type";
import Input from "@/shared/components/form/Input";
import Skeleton from "@/shared/components/skeleton/Skeleton";

const MAX_WATCH_COUNT = 10;
const DEFAULT_VIEW_COUNT = 5;

type FilterMode = "market" | "sector";
type MarketFilter = "all" | Market | "watch";

const marketFilters: { label: string; value: MarketFilter }[] = [
  { label: "전체", value: "all" },
  { label: "KOSPI", value: "KOSPI" },
  { label: "KOSDAQ", value: "KOSDAQ" },
  { label: "미국", value: "NASDAQ" },
  { label: "내 관심종목", value: "watch" },
];

// 업종 등락에 따른 AI 코멘트 생성 (mock)
const getSectorComment = (name: string, changePercent: number, stockCount: number) => {
  const abs = Math.abs(changePercent);
  const direction = changePercent >= 0 ? "상승" : "하락";
  const intensity = abs >= 2 ? "강한" : abs >= 1 ? "완만한" : "미미한";
  const outlook = changePercent >= 0
    ? "관련 종목들에 대한 시장의 관심이 높아지고 있어요."
    : "단기적으로 투자심리가 다소 위축된 모습이에요.";
  return `${name} 업종은 오늘 ${intensity} ${direction} 흐름을 보이며 ${abs.toFixed(1)}% ${direction}했습니다. 현재 집계된 관련 종목은 ${stockCount}개이며, ${outlook}`;
};

// AI 평가 배지 스타일
const sentimentStyle: Record<AiSentiment, string> = {
  긍정: "bg-red-950 text-red-300",
  중립: "bg-gray-800 text-gray-400",
  부정: "bg-sky-950 text-sky-300",
};

// 로고 배경색 팔레트
const logoColors = [
  "bg-blue-800 text-blue-200",
  "bg-orange-800 text-orange-200",
  "bg-green-800 text-green-200",
  "bg-yellow-800 text-yellow-200",
  "bg-red-800 text-red-200",
  "bg-purple-800 text-purple-200",
  "bg-teal-800 text-teal-200",
  "bg-pink-800 text-pink-200",
];

export default function StockSearchPage() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: stocks, isLoading } = useStockListQuery();
  const { data: disclosures, isLoading: isDisclosuresLoading } = useDisclosuresQuery();
  const { data: sectors, isLoading: isSectorsLoading } = useSectorSummariesQuery();
  const { data: me } = useGetMeQuery();

  const [filterMode, setFilterMode] = useState<FilterMode>(searchParams.get("tab") === "sector" ? "sector" : "market");
  const [searchQuery, setSearchQuery] = useState("");
  const [marketFilter, setMarketFilter] = useState<MarketFilter>("all");
  const [selectedSector, setSelectedSector] = useState<string | null>(searchParams.get("sector"));
  const [isSectorListExpanded, setIsSectorListExpanded] = useState(false);
  const [watchedCodes, setWatchedCodes] = useState<Set<string>>(new Set());

  // 목록이 새로 도착하면 mock 관심종목으로 초기화 (렌더 중 상태 조정)
  const [syncedStocks, setSyncedStocks] = useState(stocks);
  if (stocks !== syncedStocks) {
    setSyncedStocks(stocks);
    setWatchedCodes(new Set(stocks?.filter((s) => s.watched).map((s) => s.code) ?? []));
  }

  // 공시 클릭 시 해당 기업으로 검색
  const handleDisclosureClick = (corpName: string) => {
    setFilterMode("market");
    setMarketFilter("all");
    setSearchQuery(corpName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleWatch = (code: string) => {
    setWatchedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else if (next.size < MAX_WATCH_COUNT) {
        next.add(code);
      }
      return next;
    });
  };

  const isSectorMode = filterMode === "sector";
  const isWatchFilter = !isSectorMode && marketFilter === "watch";
  const needsLogin = isWatchFilter && !me;

  const activeSector = selectedSector ?? sectors?.[0]?.name ?? null;
  const activeSectorSummary = sectors?.find((s) => s.name === activeSector) ?? null;

  const visibleStocks = useMemo(() => {
    if (!stocks) return [];
    const query = searchQuery.trim().toLowerCase();
    return stocks.filter((stock) => {
      const matchesFilter = isSectorMode
        ? stock.sector === activeSector
        : marketFilter === "all" || (isWatchFilter ? watchedCodes.has(stock.code) : stock.market === marketFilter);
      const matchesQuery = !query || stock.name.toLowerCase().includes(query) || stock.code.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  }, [stocks, isSectorMode, activeSector, marketFilter, isWatchFilter, watchedCodes, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;
  const displayedStocks = (isSearching || isWatchFilter || isSectorMode) ? visibleStocks : visibleStocks.slice(0, DEFAULT_VIEW_COUNT);

  const listLabel = isSectorMode
    ? `${activeSector ?? ""} · ${visibleStocks.length}건`
    : isWatchFilter
      ? `관심 종목 ${visibleStocks.length}건`
      : isSearching
        ? `검색 결과 ${visibleStocks.length}건`
        : "거래량 상위 종목";

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-1">종목 검색</h1>
        <p className="text-sm text-gray-500">종목명 또는 티커로 검색해보세요.</p>
      </div>

      {/* 검색창 */}
      <div className="relative mb-6">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
        <Input
          type="text"
          placeholder="종목명 또는 티커 입력 (예: 삼성전자, AAPL)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 py-4 rounded-2xl"
        />
      </div>

      {/* 시장별 / 업종별 탭 */}
      <div className="flex items-center gap-4 mb-4">
        <TabButton active={!isSectorMode} onClick={() => setFilterMode("market")}>시장별</TabButton>
        <TabButton active={isSectorMode} onClick={() => setFilterMode("sector")}>업종별</TabButton>
      </div>

      {/* 필터 칩 */}
      {isSectorMode ? (
        <div className="relative mb-3">
          <div className={clsx("flex gap-2", isSectorListExpanded ? "flex-wrap" : "flex-nowrap overflow-hidden")}>
            {isSectorsLoading ? (
              Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-xl flex-shrink-0" />)
            ) : (
              sectors?.map((sector) => (
                <button
                  key={sector.name}
                  onClick={() => setSelectedSector(sector.name)}
                  className={clsx(
                    "px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors flex-shrink-0",
                    activeSector === sector.name
                      ? "bg-blue-500 text-white"
                      : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white"
                  )}
                >
                  {sector.name}
                </button>
              ))
            )}
          </div>
          {/* 잘린 태그를 가려주는 페이드 */}
          {!isSectorListExpanded && (
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-gray-950 to-transparent pointer-events-none" />
          )}
        </div>
      ) : (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {marketFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setMarketFilter(filter.value)}
              className={clsx(
                "px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors flex items-center gap-1",
                marketFilter === filter.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white"
              )}
            >
              {filter.label}
              {filter.value === "watch" && !me && <span className="text-xs text-gray-600">(로그인 필요)</span>}
            </button>
          ))}
        </div>
      )}

      {isSectorMode && !isSectorsLoading && (
        <button
          onClick={() => setIsSectorListExpanded((prev) => !prev)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors mb-6"
        >
          {isSectorListExpanded ? "접기" : "업종 더보기"}
          <ChevronDown className={clsx("w-3.5 h-3.5 transition-transform", isSectorListExpanded && "rotate-180")} />
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

        {/* 검색 결과 (8칸) */}
        <div className={clsx("md:col-span-8", isSectorMode && "order-2 md:order-1")}>
          {needsLogin ? (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-10 text-center">
              <p className="text-sm font-medium text-gray-400 mb-1">관심 종목을 등록하고 모아볼 수 있어요.</p>
              <p className="text-xs text-gray-600 mb-4">로그인 후 관심 종목을 등록해보세요.</p>
              <Link href="/login" className="inline-block px-4 py-2 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                로그인하기
              </Link>
            </div>
          ) : (
            <>
              <div className="text-xs text-gray-600 mb-4">{isLoading ? "" : listLabel}</div>

              {isLoading ? (
                <StockListSkeleton />
              ) : displayedStocks.length === 0 ? (
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-10 text-center">
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    {isSectorMode ? "해당 업종의 종목이 없습니다." : isWatchFilter ? "등록된 관심 종목이 없습니다." : "검색 결과가 없습니다."}
                  </p>
                  <p className="text-xs text-gray-600">
                    {isSectorMode ? "다른 업종을 선택해보세요." : isWatchFilter ? "별 아이콘을 눌러 관심 종목을 등록해보세요." : "다른 종목명이나 티커로 검색해보세요."}
                  </p>
                </div>
              ) : (
                <>
                  {/* 데스크탑: 표 */}
                  <div className="hidden md:block bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                    <table className="w-full table-fixed">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">종목</th>
                          <th className="text-right text-xs font-medium text-gray-500 px-4 py-3 whitespace-nowrap">현재가</th>
                          <th className="text-right text-xs font-medium text-gray-500 px-4 py-3 whitespace-nowrap">등락률</th>
                          <th className="text-right text-xs font-medium text-gray-500 px-4 py-3 whitespace-nowrap">AI 평가</th>
                          {!isSectorMode && <th className="text-right text-xs font-medium text-gray-500 px-4 py-3 whitespace-nowrap">관심</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {displayedStocks.map((stock, index) => (
                          <tr
                            key={stock.code}
                            onClick={() => router.push(`/stocks/${stock.code}`)}
                            className="border-b border-gray-800 last:border-0 hover:bg-gray-800 transition-colors cursor-pointer"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0", logoColors[index % logoColors.length])}>
                                  {stock.name.slice(0, 1)}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-100 text-sm truncate">{stock.name}</div>
                                  <div className="text-xs text-gray-500">{stock.code} · {stock.market}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-gray-100 text-sm font-medium whitespace-nowrap">
                              {stock.market === "NASDAQ" ? `$${stock.price.toFixed(2)}` : `${stock.price.toLocaleString()}원`}
                            </td>
                            <td className={clsx(
                              "px-4 py-3 text-right text-sm font-medium whitespace-nowrap tabular-nums",
                              stock.changePercent >= 0 ? "text-red-400" : "text-sky-400"
                            )}>
                              {stock.changePercent >= 0 ? "▲ +" : "▼ "}{stock.changePercent.toFixed(1)}%
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className={clsx("px-2 py-1 text-xs font-medium rounded-lg", sentimentStyle[stock.aiSentiment])}>
                                {stock.aiSentiment}
                              </span>
                            </td>
                            {!isSectorMode && (
                              <td className="px-4 py-3 text-right">
                                <WatchButton watched={watchedCodes.has(stock.code)} onClick={() => toggleWatch(stock.code)} />
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 모바일: 리스트 */}
                  <div className="md:hidden divide-y divide-gray-800/50">
                    {displayedStocks.map((stock, index) => (
                      <div
                        key={stock.code}
                        onClick={() => router.push(`/stocks/${stock.code}`)}
                        className="py-3 px-2 cursor-pointer hover:bg-gray-900 rounded-xl transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0", logoColors[index % logoColors.length])}>
                              {stock.name.slice(0, 1)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-100 text-sm">{stock.name}</div>
                              <div className="text-xs text-gray-500">{stock.code} · {stock.market}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-medium text-gray-100 text-sm">
                                {stock.market === "NASDAQ" ? `$${stock.price.toFixed(2)}` : `${stock.price.toLocaleString()}원`}
                              </div>
                              <div className={clsx("text-xs tabular-nums", stock.changePercent >= 0 ? "text-red-400" : "text-sky-400")}>
                                {stock.changePercent >= 0 ? "▲ +" : "▼ "}{stock.changePercent.toFixed(1)}%
                              </div>
                            </div>
                            {!isSectorMode && <WatchButton watched={watchedCodes.has(stock.code)} onClick={() => toggleWatch(stock.code)} />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* 우측 패널 (4칸): 업종별 → AI 업종평가 / 시장별 → 오늘의 공시 */}
        <div className={clsx("md:col-span-4", isSectorMode ? "order-1 md:order-2" : "hidden md:block")}>
          {isSectorMode ? (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="text-sm font-semibold text-gray-100 mb-4">AI 업종평가</h3>
              {isSectorsLoading ? (
                <div>
                  <Skeleton className="h-4 w-20 mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ) : activeSector && activeSectorSummary ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-200">{activeSector}</span>
                    <span className={clsx(
                      "text-xs font-medium tabular-nums",
                      activeSectorSummary.changePercent >= 0 ? "text-red-400" : "text-sky-400"
                    )}>
                      {activeSectorSummary.changePercent >= 0 ? "▲ +" : "▼ "}{activeSectorSummary.changePercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-start gap-2 bg-gray-800/60 rounded-xl p-3">
                    <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {getSectorComment(activeSector, activeSectorSummary.changePercent, visibleStocks.length)}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-xs text-gray-600">업종을 선택해보세요.</p>
              )}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="text-sm font-semibold text-gray-100 mb-4">오늘의 공시</h3>
              {isDisclosuresLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-3 w-16 mb-1.5" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              ) : !disclosures?.length ? (
                <p className="text-xs text-gray-600">오늘 등록된 공시가 없어요.</p>
              ) : (
                <div className="space-y-4">
                  {disclosures.map((disclosure) => (
                    <button
                      key={disclosure.id}
                      onClick={() => handleDisclosureClick(disclosure.corpName)}
                      className="flex items-start gap-2 w-full text-left hover:bg-gray-800/60 rounded-lg p-1.5 -m-1.5 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-medium text-gray-200 truncate">{disclosure.corpName}</span>
                          <span className="text-xs text-gray-600 flex-shrink-0">{disclosure.receivedAt}</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">{disclosure.reportName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 시장별/업종별 탭 버튼
function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "text-lg font-bold transition-colors",
        active ? "text-gray-100" : "text-gray-600 hover:text-gray-400"
      )}
    >
      {children}
    </button>
  );
}

// 관심 종목 별 토글 버튼
function WatchButton({ watched, onClick }: { watched: boolean; onClick: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={watched ? "text-blue-400" : "text-gray-600 hover:text-blue-400 transition-colors"}
    >
      <Star className="w-5 h-5" fill={watched ? "currentColor" : "none"} />
    </button>
  );
}

// 검색 결과 로딩 스켈레톤
function StockListSkeleton() {
  return (
    <>
      {/* 데스크탑: 박스형 표 */}
      <div className="hidden md:block bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1.5" />
              <Skeleton className="h-3 w-14" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      {/* 모바일: 테두리 없는 줄 리스트 */}
      <div className="md:hidden divide-y divide-gray-800/50">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3 px-2">
            <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1.5" />
              <Skeleton className="h-3 w-14" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </>
  );
}
