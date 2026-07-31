import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function StockCardWrapSkeleton() {

  return (
    <div className="divide-y divide-gray-800/50">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3.5 py-3 px-2 -mx-2">
          <Skeleton className="w-9 h-9 md:w-10 md:h-10 rounded-md flex-shrink-0" />

          <div className="min-w-0 flex-1">
            <Skeleton className="h-5 md:h-6 w-24 mb-0.5" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="text-right flex-shrink-0 mr-2">
            <Skeleton className="h-5 md:h-6 w-16 mb-0.5 ml-auto" />
            <Skeleton className="h-4 md:h-5 w-10 ml-auto" />
          </div>

          <Skeleton className="hidden sm:block h-6 w-12 rounded-md flex-shrink-0" />
          <Skeleton className="w-8 h-8 rounded-md flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}