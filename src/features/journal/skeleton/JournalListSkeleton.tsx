import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function JournalListSkeleton() {

  return (
    <div className="divide-y divide-gray-800/50">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 md:gap-4 py-3 px-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 mb-2">
              <Skeleton className="h-5 w-10 rounded-sm flex-shrink-0" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-3 w-40 mb-1.5" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex flex-col md:flex-row items-end md:items-center gap-1.5 md:gap-4 flex-shrink-0">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
