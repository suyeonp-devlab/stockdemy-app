import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function SectorRankingCardSkeleton() {

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <Skeleton className="h-5 w-4 flex-shrink-0" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 w-14 flex-shrink-0" />
          </div>
        ))}
      </div>
      <div className="hidden md:block md:flex-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <Skeleton className="h-5 w-4 flex-shrink-0" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 w-14 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
