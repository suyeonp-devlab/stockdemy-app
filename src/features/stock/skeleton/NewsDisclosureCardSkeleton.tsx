import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function NewsDisclosureCardSkeleton() {

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* 관련 뉴스 */}
      <div className="md:flex-1 min-w-0">
        <div className="mb-4 pl-1 pr-px">
          <Skeleton className="h-5 w-20" />
        </div>

        <div className="bg-gray-900 rounded-md p-4 pt-1 divide-y divide-gray-700/50">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="py-5 px-3 -mx-3">
              <div className="flex items-center gap-2 mb-3 md:mb-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-6 w-12 rounded-md ml-auto" />
              </div>
              <Skeleton className="h-6 md:h-7 w-full mb-2" />
              <Skeleton className="h-4 md:h-5 w-16 mb-1" />
              <Skeleton className="h-5 md:h-6 w-full mb-1" />
              <Skeleton className="h-5 md:h-6 w-2/3" />
            </div>
          ))}
        </div>
      </div>

      {/* 관련 공시 */}
      <div className="md:w-90 flex-shrink-0">
        <div className="space-y-4">
          <Skeleton className="h-5 w-20 ml-1" />

          <div className="bg-gray-900 rounded-md p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-2 py-1 my-1">
                <Skeleton className="w-4 h-4 rounded flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-4 w-32 mb-0.5" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}