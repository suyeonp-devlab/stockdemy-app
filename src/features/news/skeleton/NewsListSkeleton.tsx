import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function NewsListSkeleton() {

  return (
    <div className="divide-y divide-gray-800/50">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="py-5 px-3 -mx-3">
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  );
}