import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function MarketTickerSkeleton() {

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-3 flex items-center gap-7">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-32 flex-shrink-0" />
        ))}
      </div>
    </div>
  );
}
