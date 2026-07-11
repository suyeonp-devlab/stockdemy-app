"use client";

import { useMemo } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useSectorSummariesQuery } from "@/features/dashboard/dashboard.query";
import { SectorSummary } from "@/features/dashboard/dashboard.type";
import Skeleton from "@/shared/components/skeleton/Skeleton";

// 표시할 최대 업종 수 (등락폭 큰 순)
const DESKTOP_MAX_COUNT = 20;
const MOBILE_MAX_COUNT = 10;

// "Hot" 배지를 붙일 상위 순위 개수
const HOT_RANK_COUNT = 3;

export default function SectorHeatmap() {

  const { data: sectors, isLoading } = useSectorSummariesQuery();

  const sortedSectors = useMemo(() => {
    if (!sectors?.length) return [];
    return [...sectors].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
  }, [sectors]);

  const desktopSectors = sortedSectors.slice(0, DESKTOP_MAX_COUNT);
  const mobileSectors = sortedSectors.slice(0, MOBILE_MAX_COUNT);
  const desktopHalf = Math.ceil(desktopSectors.length / 2);
  const desktopLeft = desktopSectors.slice(0, desktopHalf);
  const desktopRight = desktopSectors.slice(desktopHalf);

  if (!isLoading && !sectors?.length) return null;

  return (
    <section className="max-w-screen-2xl mx-auto px-6 md:px-10 pb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-100">실시간 이슈 업종</h2>
        <Link href="/stocks?tab=sector" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">전체 보기</Link>
      </div>

      {isLoading ? (
        <SectorListSkeleton />
      ) : (
        <>
          {/* 데스크탑: 2단 리스트 */}
          <div className="hidden md:grid grid-cols-2 gap-x-10">
            <div className="divide-y divide-gray-800/50">
              {desktopLeft.map((sector, index) => (
                <SectorRow key={sector.name} sector={sector} rank={index + 1} isHot={index < HOT_RANK_COUNT} />
              ))}
            </div>
            <div className="divide-y divide-gray-800/50">
              {desktopRight.map((sector, index) => (
                <SectorRow key={sector.name} sector={sector} rank={desktopHalf + index + 1} isHot={desktopHalf + index < HOT_RANK_COUNT} />
              ))}
            </div>
          </div>

          {/* 모바일: 1단 리스트 */}
          <div className="md:hidden divide-y divide-gray-800/50">
            {mobileSectors.map((sector, index) => (
              <SectorRow key={sector.name} sector={sector} rank={index + 1} isHot={index < HOT_RANK_COUNT} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

// 업종 순위 한 줄
function SectorRow({ sector, rank, isHot }: { sector: SectorSummary; rank: number; isHot: boolean }) {
  const isUp = sector.changePercent >= 0;
  return (
    <Link
      href={`/stocks?tab=sector&sector=${encodeURIComponent(sector.name)}`}
      className="flex items-center gap-3 py-3 px-2 -mx-2 hover:bg-gray-900 rounded-xl transition-colors"
    >
      <span className="text-xs text-gray-600 w-5 flex-shrink-0 tabular-nums">{rank}</span>
      <span className="text-sm font-medium text-gray-200 flex-1 truncate">{sector.name}</span>
      {isHot && (
        <span className="px-1.5 py-0.5 bg-gray-800 text-gray-400 text-[10px] font-semibold rounded-md flex-shrink-0">Hot</span>
      )}
      <span className={clsx("text-sm font-medium tabular-nums flex-shrink-0", isUp ? "text-red-400" : "text-sky-400")}>
        {isUp ? "▲ +" : "▼ "}{sector.changePercent.toFixed(2)}%
      </span>
    </Link>
  );
}

// 로딩 스켈레톤
function SectorListSkeleton() {
  const row = (i: number) => (
    <div key={i} className="flex items-center gap-3 py-3 px-2">
      <Skeleton className="h-3 w-4 flex-shrink-0" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 w-14 flex-shrink-0" />
    </div>
  );
  return (
    <>
      <div className="hidden md:grid grid-cols-2 gap-x-10">
        <div className="divide-y divide-gray-800/50">{Array.from({ length: 10 }).map((_, i) => row(i))}</div>
        <div className="divide-y divide-gray-800/50">{Array.from({ length: 10 }).map((_, i) => row(i))}</div>
      </div>
      <div className="md:hidden divide-y divide-gray-800/50">
        {Array.from({ length: 10 }).map((_, i) => row(i))}
      </div>
    </>
  );
}
