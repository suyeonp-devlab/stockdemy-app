import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function CategoryFilterSkeleton() {

  return (
    <div className="flex gap-2 flex-nowrap overflow-x-auto scrollbar-hide scroll-fade-mask pb-1 -mx-6 px-6">
      {["w-12", "w-14", "w-14", "w-24"].map((w, i) => (
        <Skeleton key={i} className={`h-10 rounded-md flex-shrink-0 ${w}`} />
      ))}
    </div>
  );
}