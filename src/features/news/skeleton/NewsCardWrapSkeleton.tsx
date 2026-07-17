import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function NewsCardWrapSkeleton() {

  return (
    <div className="divide-y divide-gray-800/50">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="py-5 px-3 -mx-3">
          {/* 메타정보 */}
          <div className="flex items-center gap-2 mb-3 md:mb-2">
            <Skeleton className="w-8 h-6 rounded flex-shrink-0" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-12 rounded-md ml-auto" />
          </div>
          {/* 제목 */}
          <Skeleton className="h-5 md:h-7 w-full mb-2" />
          {/* AI 요약 */}
          <Skeleton className="h-4 w-16 mb-1" />
          {/* 요약 2줄 */}
          <Skeleton className="h-4 md:h-5 w-full mb-2" />
          <Skeleton className="h-4 md:h-5 w-2/3 mb-2" />
        </div>
      ))}
    </div>
  );
}
