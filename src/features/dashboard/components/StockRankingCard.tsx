"use client";

import Link from "next/link";
import { ChevronRight, Newspaper } from "lucide-react";
import { useGetStockListQuery } from "@/features/stock/stock.query";
import { useStockLiveQuotes } from "@/features/stock/hooks/useStockLiveQuotes";
import StockCardWrapSkeleton from "@/features/stock/skeleton/StockCardWrapSkeleton";
import React from "react";
import StockCard from "@/features/stock/components/StockCard";
import { LOGO_COLORS } from "@/features/stock/components/StockCardWrap";

const PAGE_SIZE = 10;

export default function StockRankingCard() {

  const { data: stockResponse, isLoading } = useGetStockListQuery({
    market: "", sector: "", keyword: "", favorite: false, topVolume: true, page: 1, pageSize: PAGE_SIZE,
  });

  const stockList = stockResponse?.items ?? [];

  // 현재 목록의 실시간 시세 폴링 병합 + 가격변경 깜빡임 효과
  const { mergedStockList, flashDirections } = useStockLiveQuotes(stockList);

  return (
    <div className="rounded-md border border-gray-800 p-6 pb-3.5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-100">거래량 상위</h2>
        {!isLoading && mergedStockList.length > 0 && (
          <Link href="/stock" className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
            더보기<ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* 조회중 */}
      {isLoading && <StockCardWrapSkeleton showFavorite={false} />}

      {/* 미존재 */}
      {!isLoading && mergedStockList.length === 0 && (
        <div className="py-6 text-center">
          <Newspaper className="w-14 h-14 text-gray-700 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-sm font-medium text-gray-400 mb-1">현재 수집된 거래량 상위 정보가 없습니다.</p>
        </div>
      )}

      {/* 존재 */}
      {!isLoading && mergedStockList.length > 0 && (
        <div className="divide-y divide-gray-800/50">
          {mergedStockList.map((stock, index) => (
            <StockCard
              key={stock.stockCode}
              stock={stock}
              logoClassName={LOGO_COLORS[index % LOGO_COLORS.length]}
              flashDirection={flashDirections.get(stock.stockCode)}
              showFavorite={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}