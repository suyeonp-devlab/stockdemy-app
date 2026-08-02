"use client";

import { useGetMarketIndicesQuery } from "@/features/dashboard/dashboard.query";
import MarketTickerSkeleton from "@/features/dashboard/skeleton/MarketTickerSkeleton";
import MarketTickerRow from "@/features/dashboard/components/MarketTickerRow";

export default function MarketTicker() {

  const { data: indices = [], isLoading } = useGetMarketIndicesQuery();

  // 조회중
  if (isLoading) return <MarketTickerSkeleton />

  // 미존재
  if (indices.length === 0) return null;

  return (
    <div className="bg-gray-900 border-b border-gray-800 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-3 scroll-fade-mask">
        {/* 모바일: 자동 스크롤 (두벌 이어붙여 사용) / 데스크탑: 정적 나열 */}
        <div className="flex w-max gap-7 animate-marquee md:animate-none hover:[animation-play-state:paused]">
          {indices.map((index) => <MarketTickerRow key={`${index.marketCode}_a`} index={index} />)}
          {indices.map((index) => <MarketTickerRow key={`${index.marketCode}_b`} index={index} className="md:hidden" />)}
        </div>
      </div>
    </div>
  );
}
