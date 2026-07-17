import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function SentimentCardSkeleton() {

  return (
    <div className="bg-gray-900 rounded-md md:border md:border-gray-800 pt-3 md:p-5">
      <Skeleton className="hidden md:block h-5 w-28 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      <Skeleton className="h-4 w-36 mt-4" />
    </div>
  );
}
