import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function RelatedNewsCardSkeleton() {

  return (
    <div className="hidden md:block w-76 flex-shrink-0">
      <div className="bg-gray-900 rounded-md border border-gray-800 p-5">
        <Skeleton className="h-4 w-32 mb-2" />
        <div className="divide-y divide-gray-800/50">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="py-2">
              <Skeleton className="h-3.5 w-full mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}