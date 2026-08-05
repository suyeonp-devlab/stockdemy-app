import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function JournalWriteSkeleton() {

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 종목 */}
      <div className="mt-10">
        <Skeleton className="h-4 w-10 mb-2.5" />
        <Skeleton className="h-[46px] w-full rounded-md" />
      </div>

      {/* 거래 유형 */}
      <div className="pt-5 border-t border-gray-800">
        <Skeleton className="h-4 w-16 mb-2.5" />
        <div className="flex gap-2 md:gap-4">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 flex-1 rounded-md" />
        </div>
      </div>

      {/* 거래일 */}
      <div className="pt-5 border-t border-gray-800">
        <Skeleton className="h-4 w-12 mb-2.5" />
        <div className="flex gap-2 mb-2.5">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        <Skeleton className="h-[46px] w-full rounded-md" />
      </div>

      {/* 거래 가격 + 수량 */}
      <div className="flex gap-2 md:gap-4 pt-5 border-t border-gray-800">
        <div className="flex-1">
          <Skeleton className="h-4 w-16 mb-2.5" />
          <Skeleton className="h-[46px] w-full rounded-md" />
        </div>
        <div className="flex-1">
          <Skeleton className="h-4 w-16 mb-2.5" />
          <Skeleton className="h-[46px] w-full rounded-md" />
        </div>
      </div>

      {/* 메모 */}
      <div className="pt-5 border-t border-gray-800">
        <Skeleton className="h-4 w-10 mb-2.5" />
        <Skeleton className="h-32 w-full rounded-md" />
      </div>

      {/* 버튼 */}
      <div className="flex flex-col gap-3 border-t border-gray-800 pt-6">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <Skeleton className="h-11 flex-1 rounded-md" />
          <Skeleton className="h-11 flex-1 rounded-md" />
        </div>
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
    </div>
  );
}
