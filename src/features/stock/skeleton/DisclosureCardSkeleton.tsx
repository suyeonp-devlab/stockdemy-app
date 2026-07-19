import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function DisclosureCardSkeleton() {

  return (
    <div className="bg-gray-900 rounded-md md:border md:border-gray-800 pt-3 md:p-5">
      <Skeleton className="hidden md:block h-5 w-24 mb-4" />

      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-2 py-1 my-1">
          <Skeleton className="w-4 h-4 rounded flex-shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-3 w-32 mb-1.5" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}