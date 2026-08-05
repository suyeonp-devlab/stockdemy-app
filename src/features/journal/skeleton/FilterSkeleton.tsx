import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function FilterSkeleton() {

  return (
    <div className="flex gap-2 flex-nowrap overflow-x-auto scrollbar-hide pb-1 -mx-6 px-6">
      {widths.map((w, i) => (
        <Skeleton key={i} className={`h-[42px] rounded-md flex-shrink-0 ${w}`} />
      ))}
    </div>
  );
}

// filter 너비
const widths = ["w-14", "w-24", "w-20", "w-20"];
