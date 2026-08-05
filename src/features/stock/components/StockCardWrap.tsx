"use client";

import React from "react";
import clsx from "clsx";
import { Stock, TabMode } from "@/features/stock/stock.type";
import StockCardWrapSkeleton from "@/features/stock/skeleton/StockCardWrapSkeleton";
import { Newspaper } from "lucide-react";
import Pagination from "@/shared/components/pagination/Pagination";
import StockCard from "@/features/stock/components/StockCard";
import { useStockLiveQuotes } from "@/features/stock/hooks/useStockLiveQuotes";

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

  // 현재 목록의 실시간 시세 폴링 병합 + 가격변경 깜빡임 효과
  const { mergedStockList, flashDirections } = useStockLiveQuotes(stockList);

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
                logoClassName={LOGO_COLORS[index % LOGO_COLORS.length]}
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
export const LOGO_COLORS = [
  "bg-blue-800 text-blue-200",
  "bg-orange-800 text-orange-200",
  "bg-green-800 text-green-200",
  "bg-yellow-800 text-yellow-200",
  "bg-red-800 text-red-200",
  "bg-purple-800 text-purple-200",
  "bg-teal-800 text-teal-200",
  "bg-pink-800 text-pink-200",
];