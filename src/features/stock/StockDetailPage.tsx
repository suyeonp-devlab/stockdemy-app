"use client";

import { useState } from "react";
import clsx from "clsx";
import { useGetStockFundamentalsQuery, useGetTodayQuoteQuery } from "@/features/stock/stock.query";
import StockDetailSkeleton from "@/features/stock/skeleton/StockDetailSkeleton";
import NotFoundFeedback from "@/shared/components/feedback/NotFoundFeedback";
import { formatPrice } from "@/shared/utils/number";
import UnderlineTab, { UnderlineTabOption } from "@/shared/components/tab/UnderlineTab";
import StockInfoCard from "@/features/stock/components/StockInfoCard";
import NewsDisclosureCard from "@/features/stock/components/NewsDisclosureCard";
import StockChart from "@/features/stock/components/StockChart";

type Tab = "CHART" | "NEWS" | "INFO";

interface StockDetailPageProps {
  stockCode: string;
}

export default function StockDetailPage({ stockCode }: StockDetailPageProps) {

  // 선택한 탭
  const [tab, setTab] = useState<Tab>("CHART");

  const { data: fundamentals, isLoading, isError } = useGetStockFundamentalsQuery(stockCode);
  const { data: todayQuote, isLoading: isTodayQuoteLoading, isError: isTodayQuoteError } = useGetTodayQuoteQuery(stockCode);

  const isPending = isLoading || isTodayQuoteLoading;
  const isNotFound = !fundamentals || isError || !todayQuote || isTodayQuoteError;

  // 조회중
  if (isPending) return <StockDetailSkeleton />

  // 미존재
  if (isNotFound) return <NotFoundFeedback text="종목 검색으로 이동" href="/stock" className="h-[calc(100vh-170px)] md:h-[calc(100vh-160px)]" />

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10">
      <div className="flex-1 flex-col items-start justify-between mb-8">
        <div className="flex justify-between mb-1">
          <div>
            <span className="md:text-2xl font-bold text-gray-100 mr-3">{fundamentals.stockName}</span>
            <span className={clsx("px-2 py-1 text-xs md:text-sm font-medium rounded-md", sentimentStyles[fundamentals.sentiment])}>
              {fundamentals.sentimentNm}
            </span>
          </div>
          <div className="text-lg md:text-2xl font-bold text-gray-100">
            {formatPrice(todayQuote.price, fundamentals.market)}
          </div>
        </div>

        <div className="flex justify-between">
          <p className="text-xs md:text-sm text-gray-500">
            {fundamentals.stockCode} · {fundamentals.marketNm} · {fundamentals.sectorNm}
          </p>
          <div className={clsx("text-xs md:text-base font-medium tabular-nums", todayQuote.changePercent >= 0 ? "text-red-400" : "text-sky-400")}>
            {todayQuote.changePercent >= 0 ? "▲ +" : "▼ "}{todayQuote.changePercent}%
          </div>
        </div>
      </div>

      {/* 밑줄 탭 */}
      <UnderlineTab options={TABS} value={tab} onChange={(value) => setTab(value as Tab)} />

      {tab === "CHART" && <StockChart stockCode={fundamentals.stockCode} todayQuote={todayQuote} aiComment={fundamentals.aiComment} />}
      {tab === "NEWS" && <NewsDisclosureCard stockCode={fundamentals.stockCode} />}
      {tab === "INFO" && <StockInfoCard fundamentals={fundamentals} todayQuote={todayQuote} />}
    </div>
  );
}

// AI 평가에 따른 스타일
const sentimentStyles: Record<string, string> = {
  POSITIVE: "bg-red-900 text-red-200",
  NEUTRAL: "bg-gray-700 text-gray-300",
  NEGATIVE: "bg-sky-900 text-sky-200",
};

// 탭 종류
const TABS: UnderlineTabOption[] = [
  { value: "CHART", label: "차트" },
  { value: "NEWS", label: "뉴스 & 공시" },
  { value: "INFO", label: "종목 정보" },
];
