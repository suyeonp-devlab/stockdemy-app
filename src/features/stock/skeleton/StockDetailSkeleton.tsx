import Skeleton from "@/shared/components/skeleton/Skeleton";
import StockChartSkeleton from "@/features/stock/skeleton/StockChartSkeleton";

export default function StockDetailSkeleton() {

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10">
      {/* 종목 헤더 */}
      <div className="flex-1 flex-col items-start justify-between mb-8">
        <div className="flex justify-between mb-1">
          <div className="flex items-center gap-3">
            <Skeleton className="h-[19px] md:h-[29px] w-24 md:w-32" />
            <Skeleton className="h-[22px] md:h-[24px] w-14 rounded-md" />
          </div>
          <Skeleton className="h-7 md:h-8 w-28" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 md:h-6 w-40" />
          <Skeleton className="h-4 md:h-6 w-16" />
        </div>
      </div>

      {/* 밑줄 탭 */}
      <div className="flex gap-2 border-b border-gray-800 mb-6">
        <Skeleton className="h-[34px] md:h-[38px] flex-1 rounded-t-md" />
        <Skeleton className="h-[34px] md:h-[38px] flex-1 rounded-t-md" />
        <Skeleton className="h-[34px] md:h-[38px] flex-1 rounded-t-md" />
      </div>

      {/* 기본 탭(차트) 영역 */}
      <StockChartSkeleton />
    </div>
  );
}
