import clsx from "clsx";
import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function StockDetailSkeleton() {

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10">
      <Skeleton className="h-4 w-24 mb-6" />

      {/* 헤더 */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex flex-col items-end">
          <Skeleton className="h-7 w-28 mb-2" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* 데스크탑: 2단 그리드 */}
      <div className="hidden md:grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <SkeletonCard bodyClassName="h-[420px]" />
          <SkeletonCard bodyClassName="h-24" />
          <SkeletonCard bodyClassName="h-24" />
        </div>
        <div className="col-span-4 space-y-6">
          <SkeletonCard bodyClassName="h-16" />
          <SkeletonCard bodyClassName="h-32" />
          <SkeletonCard bodyClassName="h-32" />
        </div>
      </div>

      {/* 모바일: 세로 나열 */}
      <div className="md:hidden flex flex-col gap-6">
        <SkeletonCard bodyClassName="h-[280px]" />
        <SkeletonCard bodyClassName="h-24" />
        <SkeletonCard bodyClassName="h-24" />
        <SkeletonCard bodyClassName="h-16" />
        <SkeletonCard bodyClassName="h-32" />
        <SkeletonCard bodyClassName="h-32" />
      </div>
    </div>
  );
}

// 카드 로딩 스켈레톤 (제목 줄 + 본문 영역)
function SkeletonCard({ bodyClassName }: { bodyClassName: string }) {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className={clsx("w-full rounded-xl", bodyClassName)} />
    </div>
  );
}
