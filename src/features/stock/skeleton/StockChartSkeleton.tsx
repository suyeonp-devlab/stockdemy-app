import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function StockChartSkeleton() {

  return (
    <div className="flex flex-col">
      {/* 차트 상단 */}
      <div className="mb-4 ml-auto pr-1">
        <div className="flex items-center gap-3 md:gap-5">
          <Skeleton className="h-4 md:h-5 w-28" />
          <div className="flex gap-1.5">
            <Skeleton className="h-6 md:h-7 w-11 rounded-sm" />
            <Skeleton className="h-6 md:h-7 w-11 rounded-sm" />
          </div>
        </div>
      </div>

      {/* 차트 내용 */}
      <div className="bg-gray-900 rounded-md p-4 pr-2">
        <Skeleton className="w-full h-[280px] md:h-[420px]" />
      </div>
    </div>
  );
}