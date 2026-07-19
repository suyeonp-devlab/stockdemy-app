import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function StockCardWrapSkeleton() {

  return (
    <>
      {/* 데스크탑: 박스형 표 */}
      <div className="hidden md:block bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1.5" />
              <Skeleton className="h-3 w-14" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      {/* 모바일: 테두리 없는 줄 리스트 */}
      <div className="md:hidden divide-y divide-gray-800/50">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3 px-2">
            <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1.5" />
              <Skeleton className="h-3 w-14" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </>
  );
}