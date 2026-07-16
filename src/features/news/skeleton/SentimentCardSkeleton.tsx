import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function SentimentCardSkeleton() {

  return (
    <div className="bg-gray-900 rounded-md border border-gray-800 p-5">
      <Skeleton className="h-5 w-28 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      <Skeleton className="h-4 w-36 mt-4" />
    </div>
  );
}
