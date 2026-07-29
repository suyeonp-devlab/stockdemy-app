import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { Stock, TabMode } from "@/features/stock/stock.type";
import StockCardWrapSkeleton from "@/features/stock/skeleton/StockCardWrapSkeleton";
import { Newspaper } from "lucide-react";
import Pagination from "@/shared/components/pagination/Pagination";
import StockCard from "@/features/stock/components/StockCard";
import { useGetStockQuotesQuery } from "@/features/stock/stock.query";

export type FlashDirection = "up" | "down";

interface StockCardWrapProps {
  isLoading: boolean;
  stockList: Stock[];
  tab: TabMode;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function StockCardWrap({
  isLoading,
  stockList,
  tab,
  page,
  totalPages,
  onPageChange,
}: StockCardWrapProps) {

  const hasStock = stockList.length > 0;

  // 서브탭 유무에 따라 종목 목록의 상단 여백 조정
  const hasSubTab = tab === "market" || tab === "sector";

  // 현재 목록의 실시간 시세 폴링
  const stockCodes = useMemo(() => stockList.map((stock) => stock.stockCode), [stockList]);
  const { data: quotes = [] } = useGetStockQuotesQuery(stockCodes);

  // 폴링된 시세를 목록에 병합
  const mergedStockList = useMemo(() => {

    if (quotes.length === 0) return stockList;

    const quoteMap = new Map(quotes.map((quote) => [quote.stockCode, quote]));

    return stockList.map((stock) => {
      const quote = quoteMap.get(stock.stockCode);
      return quote ? { ...stock, price: quote.price, changePercent: quote.changePercent, marketCap: quote.marketCap } : stock;
    });
  }, [stockList, quotes]);

  // 가격 변경 시 배경색 깜빡임 효과 (효과 대상 추적)
  const prevPricesRef = useRef<Map<string, number>>(new Map());
  const [flashDirections, setFlashDirections] = useState<Map<string, FlashDirection>>(new Map());

  useEffect(() => {

    const prevPrices = prevPricesRef.current;
    const nextPrices = new Map<string, number>();
    const nextFlashDirections = new Map<string, FlashDirection>();

    mergedStockList.forEach((stock) => {
      const prevPrice = prevPrices.get(stock.stockCode);
      if (prevPrice !== undefined && prevPrice !== stock.price) {
        nextFlashDirections.set(stock.stockCode, stock.price > prevPrice ? "up" : "down");
      }
      nextPrices.set(stock.stockCode, stock.price);
    });

    prevPricesRef.current = nextPrices;
    if (nextFlashDirections.size === 0) return;

    setFlashDirections(nextFlashDirections);
    const timer = setTimeout(() => setFlashDirections(new Map()), 600);
    return () => clearTimeout(timer);
  }, [mergedStockList]);

  return (
    <div className="flex-1 min-w-0">
      {/* 조회중 */}
      {isLoading && <StockCardWrapSkeleton />}

      {/* 미존재 */}
      {!isLoading && !hasStock && (
        <div className={clsx("p-10 text-center md:mt-16", !hasSubTab && "md:-mt-14")}>
          <Newspaper strokeWidth={0.5} className="w-24 h-24 text-gray-600 mx-auto mb-3" />
          <p className="text-sm md:text-base font-medium text-gray-600">검색 조건에 해당하는 종목이 없습니다.</p>
        </div>
      )}

      {/* 존재 */}
      {!isLoading && hasStock && (
        <div className={clsx(!hasSubTab && "md:-mt-14")}>
          <div className="divide-y divide-gray-800/50">
            {mergedStockList.map((stock, index) => (
              <StockCard
                key={stock.stockCode}
                stock={stock}
                logoClassName={logoColors[index % logoColors.length]}
                flashDirection={flashDirections.get(stock.stockCode)}
              />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}

// 종목 로고 배경색 팔레트
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