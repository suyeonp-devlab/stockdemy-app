import Skeleton from "@/shared/components/skeleton/Skeleton";
import RelatedNewsCardSkeleton from "@/features/news/skeleton/RelatedNewsCardSkeleton";

export default function NewsDetailSkeleton() {

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10">
      <div className="flex flex-col md:flex-row gap-10 justify-between">
        {/* 뉴스 상세 */}
        <div className="flex-1 min-w-0">
          {/* 주체 종목 · AI 평가 */}
          <div className="flex items-center mb-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16 ml-auto" />
          </div>

          {/* 제목 */}
          <Skeleton className="h-7 md:h-8 w-full mb-3" />
          <Skeleton className="h-4 w-28 mb-7" />

          {/* 내용 */}
          <div className="border-t border-gray-800 pt-8 space-y-9">
            <div>
              <Skeleton className="h-4 w-14 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>

            <div>
              <Skeleton className="h-4 w-20 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div>
              <Skeleton className="h-4 w-24 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-32 rounded-full" />
                <Skeleton className="h-8 w-32 rounded-full" />
              </div>
            </div>
          </div>

          {/* 출처 */}
          <div className="md:border-t md:border-gray-800 mt-4 md:mt-8 pt-4">
            <Skeleton className="h-4 w-40 ml-auto" />
          </div>
        </div>

        {/* 데스크탑: 연관 뉴스 */}
        <RelatedNewsCardSkeleton />
      </div>
    </div>
  );
}
