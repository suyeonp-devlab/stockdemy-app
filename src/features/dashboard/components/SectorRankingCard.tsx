"use client";

import Link from "next/link";
import { useGetSectorSummariesQuery } from "@/features/dashboard/dashboard.query";
import SectorRankingCardSkeleton from "@/features/dashboard/skeleton/SectorRankingCardSkeleton";
import { ChevronRight } from "lucide-react";
import React from "react";
import SectorRankingCardRow from "@/features/dashboard/components/SectorRankingCardRow";

const HOT_RANK_COUNT = 3;

export default function SectorRankingCard() {

  const { data: sectors = [], isLoading } = useGetSectorSummariesQuery();

  const half = Math.ceil(sectors.length / 2);
  const leftSectors = sectors.slice(0, half);
  const rightSectors = sectors.slice(half);

  // 미존재
  if (!isLoading && sectors.length === 0) return null;

  return (
    <div className="rounded-md border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-100">실시간 이슈 업종</h2>
        <Link href="/stock?tab=sector" className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
          더보기<ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 조회중 */}
      {isLoading && <SectorRankingCardSkeleton />}

      {/* 존재 */}
      {!isLoading && sectors.length > 0 && (
        <div className="flex flex-col md:flex-row gap-8 min-w-0">
          <div className="flex-1 min-w-0">
            {leftSectors.map((sector, idx) => (
              <SectorRankingCardRow key={sector.sector} sector={sector} rank={idx+1} isHot={idx + 1 <= HOT_RANK_COUNT} />
            ))}
          </div>
          <div className="hidden md:block md:flex-1 min-w-0">
            {rightSectors.map((sector, idx) => (
              <SectorRankingCardRow key={sector.sector} sector={sector} rank={idx+8} isHot={idx + 8 <= HOT_RANK_COUNT} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
