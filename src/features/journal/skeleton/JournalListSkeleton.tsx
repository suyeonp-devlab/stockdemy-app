import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function JournalListSkeleton() {
  return (
    <div className="divide-y divide-gray-800/50">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 md:gap-4 py-3 px-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1.5" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="hidden md:block h-3 w-10 flex-shrink-0" />
          <Skeleton className="hidden md:block h-3 w-8 flex-shrink-0" />
          <div className="flex-shrink-0 w-24">
            <Skeleton className="h-4 w-16 ml-auto mb-1.5" />
            <Skeleton className="h-3 w-10 ml-auto" />
          </div>
          <Skeleton className="hidden md:block h-5 w-10 rounded-md flex-shrink-0" />
          <Skeleton className="w-4 h-4 rounded-sm flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
