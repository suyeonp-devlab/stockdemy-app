import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function TopMentionsCardSkeleton() {

  return (
    <div className="bg-gray-900 rounded-md border border-gray-800 p-5">
      <Skeleton className="h-5 w-28 mb-4" />

      {/* 데스크탑: 세로 리스트 */}
      <div className="hidden md:block space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="py-px">
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>

      {/* 모바일: 2x2 그리드 */}
      <div className="md:hidden grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="py-px">
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
