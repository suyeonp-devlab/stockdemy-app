import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function MeProfileCardSkeleton() {

  return (
    <div className="bg-gray-900 rounded-md border border-gray-800 py-6 px-4 flex items-center gap-4 flex-1">
      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <Skeleton className="h-4 w-40 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
