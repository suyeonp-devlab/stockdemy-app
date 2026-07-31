"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { useTopVolumeStocksQuery } from "@/features/dashboard/dashboard.query";
import { AiSentiment } from "@/features/dashboard/dashboard.type";
import Skeleton from "@/shared/components/skeleton/Skeleton";

// AI 평가 배지 스타일
const sentimentStyle: Record<AiSentiment, string> = {
  긍정: "bg-red-950 text-red-300",
  중립: "bg-gray-800 text-gray-400",
  부정: "bg-sky-950 text-sky-300",
};

// 로고 배경색 팔레트 (종목 순서에 따라 순환)
const logoColors = [
  "bg-blue-800 text-blue-200",
  "bg-orange-800 text-orange-200",
  "bg-green-800 text-green-200",
  "bg-yellow-800 text-yellow-200",
  "bg-red-800 text-red-200",
  "bg-purple-800 text-purple-200",
  "bg-teal-800 text-teal-200",
  "bg-pink-800 text-pink-200",
  "bg-indigo-800 text-indigo-200",
  "bg-cyan-800 text-cyan-200",
];

export default function StockRankingCard() {

  const router = useRouter();
  const { data: stocks, isLoading } = useTopVolumeStocksQuery();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-100">거래량 상위</h2>
        <Link href="/stock" className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
          더보기<ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 데스크탑: 표 */}
      <div className="hidden md:block bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">종목</th>
              <th className="text-right text-xs font-medium text-gray-500 px-4 py-3 whitespace-nowrap">현재가</th>
              <th className="text-right text-xs font-medium text-gray-500 px-4 py-3 whitespace-nowrap">등락률</th>
              <th className="text-right text-xs font-medium text-gray-500 px-4 py-3 whitespace-nowrap">AI 평가</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-800 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-1.5" />
                        <Skeleton className="h-3 w-14" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                  <td className="px-4 py-3 text-right"><Skeleton className="h-4 w-12 ml-auto" /></td>
                  <td className="px-4 py-3 text-right"><Skeleton className="h-5 w-10 ml-auto rounded-lg" /></td>
                </tr>
              ))
            ) : stocks?.map((stock, index) => (
              <tr
                key={stock.code}
                onClick={() => router.push(`/stock/${stock.code}`)}
                className="border-b border-gray-800 last:border-0 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0", logoColors[index % logoColors.length])}>
                      {stock.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-100 text-base truncate">{stock.name}</div>
                      <div className="text-xs text-gray-500">{stock.code}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-gray-100 font-medium whitespace-nowrap">{stock.price.toLocaleString()}원</td>
                <td className={clsx(
                  "px-4 py-3 text-right text-sm font-medium whitespace-nowrap tabular-nums",
                  stock.changePercent >= 0 ? "text-red-400" : "text-sky-400"
                )}>
                  {stock.changePercent >= 0 ? "▲ +" : "▼ "}{stock.changePercent.toFixed(1)}%
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={clsx("px-2 py-1 text-xs font-medium rounded-lg", sentimentStyle[stock.aiSentiment])}>
                    {stock.aiSentiment}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일: 리스트 */}
      <div className="md:hidden divide-y divide-gray-800/50">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="py-3 px-2">
              <Skeleton className="h-4 w-10 mb-2 rounded-md" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1.5" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-16 mb-1.5 ml-auto" />
                  <Skeleton className="h-3 w-10 ml-auto" />
                </div>
              </div>
            </div>
          ))
        ) : stocks?.map((stock, index) => (
          <div
            key={stock.code}
            onClick={() => router.push(`/stock/${stock.code}`)}
            className="py-3 px-2 cursor-pointer hover:bg-gray-900 rounded-xl transition-colors"
          >
            <span className={clsx("px-2 py-0.5 text-xs font-medium rounded-md mb-2 inline-block", sentimentStyle[stock.aiSentiment])}>
              {stock.aiSentiment}
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0", logoColors[index % logoColors.length])}>
                  {stock.name.slice(0, 1)}
                </div>
                <div>
                  <div className="font-medium text-gray-100 text-sm">{stock.name}</div>
                  <div className="text-xs text-gray-500">{stock.code}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-100 text-sm">{stock.price.toLocaleString()}원</div>
                <div className={clsx("text-xs tabular-nums", stock.changePercent >= 0 ? "text-red-400" : "text-sky-400")}>
                  {stock.changePercent >= 0 ? "▲ +" : "▼ "}{stock.changePercent.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
