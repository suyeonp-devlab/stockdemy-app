"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronDown, Loader2, Plus } from "lucide-react";
import { useJournalsQuery, useRequestAiReviewMutation } from "@/features/journals/journals.query";
import { useStockListQuery } from "@/features/stocks/stocks.query";
import { JournalEntry, TradeType } from "@/features/journals/journals.type";
import { Market } from "@/features/stocks/stocks.type";
import Skeleton from "@/shared/components/skeleton/Skeleton";
import TradeTypeBadge from "@/features/journals/components/TradeTypeBadge";

type TypeFilter = "all" | TradeType;
type AiFilter = "all" | "done" | "pending";
type PeriodFilter = "all" | "1m" | "3m" | "6m" | "1y";

const typeFilters: { label: string; value: TypeFilter }[] = [
  { label: "전체", value: "all" },
  { label: "매수", value: "BUY" },
  { label: "매도", value: "SELL" },
];

const periodFilters: { label: string; value: PeriodFilter }[] = [
  { label: "전체 기간", value: "all" },
  { label: "최근 1개월", value: "1m" },
  { label: "최근 3개월", value: "3m" },
  { label: "최근 6개월", value: "6m" },
  { label: "최근 1년", value: "1y" },
];

const aiFilters: { label: string; value: AiFilter }[] = [
  { label: "전체", value: "all" },
  { label: "AI 완료", value: "done" },
  { label: "미분석", value: "pending" },
];

const periodDays: Record<Exclude<PeriodFilter, "all">, number> = { "1m": 30, "3m": 90, "6m": 180, "1y": 365 };

// 종목명 로고 배경색 팔레트
const logoColors = [
  "bg-blue-800 text-blue-200",
  "bg-orange-800 text-orange-200",
  "bg-green-800 text-green-200",
  "bg-yellow-800 text-yellow-200",
  "bg-indigo-800 text-indigo-200",
  "bg-purple-800 text-purple-200",
  "bg-teal-800 text-teal-200",
  "bg-gray-700 text-gray-200",
];

// 평균 매수가 기반 실현손익 계산 (원화 종목만 집계)
function computeRealizedProfit(journals: JournalEntry[]) {
  return journals
    .filter((entry) => entry.tradeType === "SELL" && entry.market !== "NASDAQ")
    .reduce((sum, sell) => {
      const buys = journals.filter((entry) => entry.tradeType === "BUY" && entry.stockCode === sell.stockCode);
      if (buys.length === 0) return sum;
      const avgBuyPrice = buys.reduce((s, b) => s + b.price, 0) / buys.length;
      return sum + (sell.price - avgBuyPrice) * sell.quantity;
    }, 0);
}

const formatPrice = (value: number, market: Market) =>
  market === "NASDAQ" ? `$${value.toFixed(2)}` : `${value.toLocaleString()}원`;

// 기간 필터 기준 시각 (모듈 로드 시 1회 계산)
const NOW = Date.now();

export default function JournalListPage() {

  const { data: journals, isLoading } = useJournalsQuery();
  const { data: stocks } = useStockListQuery();
  const { mutate: requestAiReview, isPending: isRequestingAi, variables: requestingId } = useRequestAiReviewMutation();

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");
  const [aiFilter, setAiFilter] = useState<AiFilter>("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const sortedJournals = useMemo(() => {
    if (!journals) return [];
    return [...journals].sort((a, b) => b.tradeDate.localeCompare(a.tradeDate));
  }, [journals]);

  const stockOptions = useMemo(() => {
    if (!journals) return [];
    const map = new Map<string, string>();
    journals.forEach((entry) => map.set(entry.stockCode, entry.stockName));
    return Array.from(map.entries());
  }, [journals]);

  const filteredJournals = useMemo(() => {
    return sortedJournals.filter((entry) => {
      const matchesType = typeFilter === "all" || entry.tradeType === typeFilter;
      const matchesStock = stockFilter === "all" || entry.stockCode === stockFilter;
      const matchesAi = aiFilter === "all" || (aiFilter === "done" ? entry.aiComment !== null : entry.aiComment === null);
      const matchesPeriod = periodFilter === "all" ||
        NOW - new Date(entry.tradeDate).getTime() <= periodDays[periodFilter] * 24 * 60 * 60 * 1000;
      return matchesType && matchesStock && matchesAi && matchesPeriod;
    });
  }, [sortedJournals, typeFilter, stockFilter, aiFilter, periodFilter]);

  const summary = useMemo(() => {
    const list = journals ?? [];
    return {
      total: list.length,
      buy: list.filter((entry) => entry.tradeType === "BUY").length,
      sell: list.filter((entry) => entry.tradeType === "SELL").length,
      realizedProfit: computeRealizedProfit(list),
    };
  }, [journals]);

  // 매수 종목의 평가손익 (현재가 대비)
  const getEvaluation = (entry: JournalEntry) => {
    if (entry.tradeType === "SELL") return null;
    const currentPrice = stocks?.find((s) => s.code === entry.stockCode)?.price;
    if (currentPrice === undefined) return null;
    const diff = (currentPrice - entry.price) * entry.quantity;
    const percent = ((currentPrice - entry.price) / entry.price) * 100;
    return { diff, percent };
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10">

      {/* 타이틀 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 mb-1">주식 일지</h1>
          <p className="text-sm text-gray-500">나의 매수·매도 기록과 AI 복기 분석을 확인해보세요.</p>
        </div>
        <Link
          href="/journals/new"
          className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          일지 작성
        </Link>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <SummaryCard label="총 일지" value={`${summary.total}건`} />
        <SummaryCard label="매수" value={`${summary.buy}건`} valueClassName="text-red-400" />
        <SummaryCard label="매도" value={`${summary.sell}건`} valueClassName="text-sky-400" />
        <SummaryCard
          label="실현 손익"
          value={`${summary.realizedProfit >= 0 ? "+" : "-"}₩${Math.round(Math.abs(summary.realizedProfit)).toLocaleString()}`}
          valueClassName={summary.realizedProfit >= 0 ? "text-red-400" : "text-sky-400"}
        />
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex gap-1.5">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setTypeFilter(filter.value)}
              className={clsx(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                typeFilter === filter.value ? "bg-blue-500 text-white" : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="w-px h-4 bg-gray-800 hidden md:block" />
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-900 text-gray-400 border border-gray-800 focus:outline-none focus:border-blue-400 cursor-pointer"
        >
          <option value="all">전체 종목</option>
          {stockOptions.map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
        <select
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value as PeriodFilter)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-900 text-gray-400 border border-gray-800 focus:outline-none focus:border-blue-400 cursor-pointer"
        >
          {periodFilters.map((filter) => (
            <option key={filter.value} value={filter.value}>{filter.label}</option>
          ))}
        </select>
        <div className="flex gap-1.5 md:ml-auto">
          {aiFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setAiFilter(filter.value)}
              className={clsx(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                aiFilter === filter.value ? "bg-blue-500 text-white" : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <JournalListSkeleton />
      ) : filteredJournals.length === 0 ? (
        <EmptyState hasAnyJournal={(journals?.length ?? 0) > 0} />
      ) : (
        <div className="divide-y divide-gray-800/50">
          {filteredJournals.map((entry, index) => {
            const isExpanded = expandedIds.has(entry.id);
            const evaluation = getEvaluation(entry);
            const isThisRequesting = isRequestingAi && requestingId === entry.id;
            return (
              <div key={entry.id}>
                <div
                  onClick={() => toggleExpanded(entry.id)}
                  className="flex items-center gap-3 md:gap-4 py-3 px-2 -mx-2 cursor-pointer hover:bg-gray-900 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={clsx("w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0", logoColors[index % logoColors.length])}>
                      {entry.stockName.slice(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-gray-100 text-sm truncate">{entry.stockName}</span>
                        <TradeTypeBadge type={entry.tradeType} />
                      </div>
                      <div className="text-xs text-gray-500 tabular-nums">
                        {entry.stockCode} · {entry.market}
                        <span className="md:hidden"> · {entry.tradeDate.slice(5).replace("-", ". ")} · {entry.quantity}주</span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block text-right text-xs text-gray-500 tabular-nums w-16 flex-shrink-0">
                    {entry.tradeDate.slice(5).replace("-", ". ")}
                  </div>
                  <div className="hidden md:block text-right text-xs text-gray-500 tabular-nums w-12 flex-shrink-0">
                    {entry.quantity}주
                  </div>

                  <div className="text-right flex-shrink-0 w-24">
                    <div className="text-sm font-medium text-gray-100 tabular-nums">{formatPrice(entry.price, entry.market)}</div>
                    {evaluation ? (
                      <div className={clsx("text-xs tabular-nums", evaluation.diff >= 0 ? "text-red-400" : "text-sky-400")}>
                        {evaluation.diff >= 0 ? "+" : ""}{evaluation.percent.toFixed(1)}%
                      </div>
                    ) : entry.aiComment ? (
                      <div className="text-xs text-blue-400">AI 완료</div>
                    ) : (
                      <div className="text-xs text-gray-600">미분석</div>
                    )}
                  </div>

                  <div className="hidden md:block flex-shrink-0 w-16 text-center">
                    {entry.aiComment ? (
                      <span className="px-2 py-0.5 bg-blue-950 text-blue-300 text-xs font-medium rounded-md">완료</span>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); requestAiReview(entry.id); }}
                        disabled={isThisRequesting}
                        className="px-2 py-0.5 bg-gray-800 hover:bg-gray-700 text-gray-500 hover:text-gray-300 text-xs font-medium rounded-md transition-colors disabled:opacity-50"
                      >
                        {isThisRequesting ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : "요청"}
                      </button>
                    )}
                  </div>

                  <ChevronDown className={clsx("w-4 h-4 text-gray-600 flex-shrink-0 transition-transform", isExpanded && "rotate-180")} />
                </div>
                {isExpanded && (
                  <div className="pb-4 px-2">
                    <JournalDetailPanel entry={entry} />
                    {!entry.aiComment && (
                      <button
                        onClick={(e) => { e.stopPropagation(); requestAiReview(entry.id); }}
                        disabled={isThisRequesting}
                        className="md:hidden mt-3 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isThisRequesting ? "요청 중..." : "AI 복기 분석 요청"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 모바일 플로팅 버튼 */}
      <Link
        href="/journals/new"
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center transition-colors z-20"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>

    </div>
  );
}

// 요약 카드
function SummaryCard({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={clsx("text-xl font-bold", valueClassName ?? "text-gray-100")}>{value}</p>
    </div>
  );
}

// 펼침 영역: AI 복기 분석 또는 메모
function JournalDetailPanel({ entry }: { entry: JournalEntry }) {
  return (
    <div className="flex gap-3">
      <div className={clsx("w-1 rounded-full flex-shrink-0", entry.aiComment ? "bg-blue-500" : "bg-gray-700")} />
      <div>
        {entry.aiComment ? (
          <>
            <p className="text-xs text-blue-400 font-semibold mb-1.5">AI 복기 분석</p>
            <p className="text-xs text-gray-400 leading-relaxed">{entry.aiComment}</p>
            {entry.memo && <p className="text-xs text-gray-600 mt-2 italic">&quot;{entry.memo}&quot;</p>}
          </>
        ) : (
          <>
            <p className="text-xs text-gray-500 font-semibold mb-1.5">메모</p>
            <p className="text-xs text-gray-400 leading-relaxed">{entry.memo || "작성된 메모가 없어요."}</p>
            <p className="text-xs text-gray-600 mt-2">AI 복기 분석을 요청해보세요.</p>
          </>
        )}
      </div>
    </div>
  );
}

// 빈 상태
function EmptyState({ hasAnyJournal }: { hasAnyJournal: boolean }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center">
      <p className="text-sm font-medium text-gray-400 mb-1">
        {hasAnyJournal ? "조건에 맞는 일지가 없어요" : "아직 일지가 없어요"}
      </p>
      <p className="text-xs text-gray-600 mb-5">
        {hasAnyJournal ? "필터를 조정해보세요." : "첫 매매 기록을 남기고 AI 복기 분석을 받아보세요."}
      </p>
      {!hasAnyJournal && (
        <Link href="/journals/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus className="w-4 h-4" />
          첫 일지 작성하기
        </Link>
      )}
    </div>
  );
}

// 목록 로딩 스켈레톤
function JournalListSkeleton() {
  return (
    <div className="divide-y divide-gray-800/50">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 md:gap-4 py-3 px-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1.5" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="hidden md:block h-3 w-10 flex-shrink-0" />
          <Skeleton className="hidden md:block h-3 w-8 flex-shrink-0" />
          <div className="flex-shrink-0 w-24">
            <Skeleton className="h-4 w-16 ml-auto mb-1.5" />
            <Skeleton className="h-3 w-10 ml-auto" />
          </div>
          <Skeleton className="hidden md:block h-5 w-10 rounded-md flex-shrink-0" />
          <Skeleton className="w-4 h-4 rounded-sm flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
