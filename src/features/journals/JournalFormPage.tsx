"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Check, ChevronLeft, Loader2, RefreshCw, Search, Sparkles, X } from "lucide-react";
import { useGetStockListQuery } from "@/features/stock/stock.query";
import { Stock, StockRequest } from "@/features/stock/stock.type";
import { useCreateJournalMutation, useJournalsQuery, useRequestAiReviewMutation } from "@/features/journals/journals.query";
import { TradeType } from "@/features/journals/journals.type";
import TradeTypeBadge from "@/features/journals/components/TradeTypeBadge";
import Skeleton from "@/shared/components/skeleton/Skeleton";

const today = () => new Date().toISOString().slice(0, 10);

// 필터 없이 전체 종목 검색용 request (임시, journals 쪽 데이터 조회 방식은 추후 재정리 예정)
const ALL_STOCKS_REQUEST: StockRequest = {
  market: "all", sector: "", stockName: "", favorite: false, topVolume: false, page: 1, pageSize: 9999,
};

// 종목 코드 기반 로고 배경색 (검색 결과/선택 표시에서 동일 종목은 항상 같은 색)
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
const getLogoColor = (stockCode: string) => logoColors[stockCode.charCodeAt(0) % logoColors.length];

const formatPrice = (value: number, market: string) =>
  market === "NASDAQ" ? `$${value.toFixed(2)}` : `${value.toLocaleString()}원`;

// 최근 작성한 일지 패널에 보여줄 최대 개수
const RECENT_COUNT = 5;

export default function JournalFormPage() {

  const router = useRouter();
  const { data: stockResponse } = useGetStockListQuery(ALL_STOCKS_REQUEST);
  const stocks = stockResponse?.items;
  const { data: journals, isLoading: isJournalsLoading } = useJournalsQuery();
  const { mutate: createJournal, isPending: isSaving } = useCreateJournalMutation();
  const { mutate: requestAiReview, isPending: isRequestingAi } = useRequestAiReviewMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [tradeType, setTradeType] = useState<TradeType>("BUY");
  const [tradeDate, setTradeDate] = useState(today());
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [memo, setMemo] = useState("");
  const [savedJournalId, setSavedJournalId] = useState<string | null>(null);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query || !stocks) return [];
    return stocks.filter((s) => s.stockName.toLowerCase().includes(query) || s.stockCode.toLowerCase().includes(query)).slice(0, 8);
  }, [stocks, searchQuery]);

  const recentJournals = useMemo(() => {
    if (!journals) return [];
    return [...journals].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, RECENT_COUNT);
  }, [journals]);

  const currency = selectedStock?.market === "NASDAQ" ? "$" : "₩";
  const totalValue = Number(price) > 0 && Number(quantity) > 0 ? Number(price) * Number(quantity) : null;
  const isValid = selectedStock !== null && tradeDate !== "" && Number(price) > 0 && Number(quantity) > 0;
  const isSaved = savedJournalId !== null;

  const handleAutoFillPrice = () => {
    if (!selectedStock) return;
    setPrice(String(selectedStock.price));
  };

  const handleSave = () => {
    if (!selectedStock || !isValid) return;
    createJournal(
      {
        stockCode: selectedStock.stockCode,
        stockName: selectedStock.stockName,
        market: selectedStock.market,
        tradeType,
        tradeDate,
        price: Number(price),
        quantity: Number(quantity),
        memo,
      },
      { onSuccess: (entry) => setSavedJournalId(entry.id) },
    );
  };

  const handleRequestAiReview = () => {
    if (!savedJournalId) return;
    requestAiReview(savedJournalId, { onSuccess: () => router.push("/journals") });
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10">

      {/* 타이틀 */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/journals" className="text-gray-600 hover:text-gray-400 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">일지 작성</h1>
          <p className="text-sm text-gray-500">매수·매도 기록을 남기고 AI 복기 분석을 받아보세요.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-8 max-w-2xl">
      <div className="space-y-6">

        {/* 종목 선택 */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2.5 block">종목</label>

          {selectedStock ? (
            <div className="flex items-center justify-between bg-gray-800 border border-blue-500 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className={clsx("w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0", getLogoColor(selectedStock.stockCode))}>
                  {selectedStock.stockName.slice(0, 1)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-100">{selectedStock.stockName}</div>
                  <div className="text-xs text-gray-500">{selectedStock.stockCode} · {selectedStock.marketNm}</div>
                </div>
              </div>
              {!isSaved && (
                <button onClick={() => setSelectedStock(null)} className="text-gray-600 hover:text-gray-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="종목명 또는 티커 검색 (예: 삼성전자, AAPL)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-400 transition-colors"
              />
              {searchResults.length > 0 && (
                <div className="absolute z-10 mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                  {searchResults.map((stock) => (
                    <button
                      key={stock.stockCode}
                      onClick={() => { setSelectedStock(stock); setSearchQuery(""); }}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-700 transition-colors text-left border-b border-gray-700 last:border-0"
                    >
                      <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0", getLogoColor(stock.stockCode))}>
                        {stock.stockName.slice(0, 1)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-100">{stock.stockName}</div>
                        <div className="text-xs text-gray-500">{stock.stockCode} · {stock.marketNm}</div>
                      </div>
                      <div className="ml-auto text-xs text-gray-500">
                        {stock.market === "NASDAQ" ? `$${stock.price.toFixed(2)}` : `${stock.price.toLocaleString()}원`}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 매수/매도 + 거래일 */}
        <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-6">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2.5 block">거래 유형</label>
            <div className="flex gap-2">
              <button
                onClick={() => setTradeType("BUY")}
                disabled={isSaved}
                className={clsx(
                  "flex-1 py-2.5 text-sm font-semibold rounded-xl border-2 transition-colors",
                  tradeType === "BUY" ? "bg-red-950 text-red-300 border-red-500" : "bg-gray-800 text-gray-500 border-transparent hover:border-gray-600"
                )}
              >
                매수
              </button>
              <button
                onClick={() => setTradeType("SELL")}
                disabled={isSaved}
                className={clsx(
                  "flex-1 py-2.5 text-sm font-semibold rounded-xl border-2 transition-colors",
                  tradeType === "SELL" ? "bg-sky-950 text-sky-300 border-sky-500" : "bg-gray-800 text-gray-500 border-transparent hover:border-gray-600"
                )}
              >
                매도
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2.5 block">거래일</label>
            <input
              type="date"
              value={tradeDate}
              onChange={(e) => setTradeDate(e.target.value)}
              disabled={isSaved}
              className="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:border-blue-400 transition-colors cursor-pointer disabled:opacity-60"
            />
          </div>
        </div>

        {/* 거래 가격 + 수량 */}
        <div className="border-t border-gray-800 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2.5 block">거래 가격</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isSaved}
                  className="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-400 transition-colors pr-10 disabled:opacity-60"
                />
                <button
                  onClick={handleAutoFillPrice}
                  disabled={!selectedStock || isSaved}
                  title="당일 시세 불러오기"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-400 transition-colors disabled:opacity-40"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1.5 flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                우측 아이콘으로 당일 시세 자동 입력
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2.5 block">수량 (주)</label>
              <input
                type="number"
                placeholder="0"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={isSaved}
                className="w-full px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-400 transition-colors disabled:opacity-60"
              />
            </div>
          </div>

          {totalValue !== null && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-gray-500">총 거래금액</span>
              <span className="text-sm font-bold text-gray-100">{currency}{totalValue.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* 메모 */}
        <div className="border-t border-gray-800 pt-6">
          <label className="text-sm font-medium text-gray-300 mb-2.5 block">메모</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            disabled={isSaved}
            placeholder={"이 판단을 내린 이유, 당시 뉴스, 매매 전략 등을 자유롭게 기록해보세요.\nAI 복기 분석 시 이 내용도 함께 참고합니다."}
            rows={5}
            className="w-full px-3 py-3 text-sm bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-400 transition-colors resize-none leading-relaxed disabled:opacity-60"
          />
          <p className="text-xs text-gray-600 mt-2">메모가 구체적일수록 AI 복기 분석이 더 정확해져요.</p>
        </div>

        {/* 저장 버튼 */}
        {!isSaved && (
          <div className="flex flex-col gap-3 border-t border-gray-800 pt-6">
            <button
              onClick={handleSave}
              disabled={!isValid || isSaving}
              className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-800 disabled:text-gray-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {isSaving ? "저장 중..." : "일지 저장하기"}
            </button>
            <Link href="/journals" className="w-full py-3 text-center text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors rounded-xl border border-gray-800 hover:border-gray-700">
              취소
            </Link>
          </div>
        )}

      </div>

      {/* 저장 후: AI 복기 요청 안내 */}
      {isSaved && (
        <div className="mt-6 border-t border-blue-500/40 pt-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-blue-300" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-100 mb-1">일지가 저장됐어요!</p>
              <p className="text-xs text-gray-500 mb-4">AI가 이 판단이 당시 시장 흐름에서 어떤 맥락이었는지 복기 분석을 해드릴 수 있어요.</p>
              <div className="flex gap-2">
                <button
                  onClick={handleRequestAiReview}
                  disabled={isRequestingAi}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {isRequestingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {isRequestingAi ? "분석 중..." : "AI 복기 분석 요청"}
                </button>
                <Link href="/journals" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs font-medium rounded-lg transition-colors">
                  나중에
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>

      {/* 최근 작성한 일지 */}
      <div className="hidden md:block md:col-span-4">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-100 mb-4">최근 작성한 일지</h3>
          {isJournalsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-20 mb-1.5" />
                    <Skeleton className="h-3 w-14" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentJournals.length === 0 ? (
            <p className="text-xs text-gray-600">아직 작성된 일지가 없어요.</p>
          ) : (
            <div className="space-y-4">
              {recentJournals.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3">
                  <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0", getLogoColor(entry.stockCode))}>
                    {entry.stockName.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-gray-200 truncate">{entry.stockName}</span>
                      <TradeTypeBadge type={entry.tradeType} />
                    </div>
                    <div className="text-xs text-gray-500 tabular-nums">
                      {entry.tradeDate.slice(5).replace("-", ". ")} · {formatPrice(entry.price, entry.market)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
    </div>
  );
}
