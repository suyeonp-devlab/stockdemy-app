import Skeleton from "@/shared/components/skeleton/Skeleton";

export default function SubFilterSkeleton() {

  return (
    <div className="flex gap-2 flex-nowrap overflow-x-auto scrollbar-hide pb-1 -mx-6 px-6 md:flex-wrap md:h-full">
      {widths.map((w, i) => (
        <Skeleton key={i} className={`h-[42px] rounded-md flex-shrink-0 ${w}`} />
      ))}
    </div>
  );
}

// filter 너비
const widths = ["w-16", "w-20", "w-14", "w-24", "w-16", "w-20"];