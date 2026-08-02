import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { SectorSummary } from "@/features/dashboard/dashboard.type";

interface SectorRankingCardRowProps {
  sector: SectorSummary;
  rank: number;
  isHot: boolean;
}

export default function SectorRankingCardRow({
  sector,
  rank,
  isHot,
}: SectorRankingCardRowProps) {

  const isUp = sector.changePercent >= 0;

  return (
    <Link
      href={`/stock?tab=sector&sector=${encodeURIComponent(sector.sector)}`}
      className="flex items-center gap-3 py-3 px-2 -mx-2 hover:bg-gray-800 transition-colors"
    >
      <span className="text-sm text-gray-600 w-3 md:w-5 flex-shrink-0 tabular-nums">{rank}.</span>
      {isHot && <span className="px-1.5 py-0.5 bg-gray-800 text-gray-400 text-[10px] font-semibold rounded-md flex-shrink-0">Hot</span>}
      <span className="text-sm font-medium text-gray-200 flex-1 truncate">{sector.sectorNm}</span>
      <span className={clsx("text-sm font-medium tabular-nums flex-shrink-0", isUp ? "text-red-400" : "text-sky-400")}>
        {isUp ? "▲ +" : "▼ "}{sector.changePercent}%
      </span>
    </Link>
  );
}