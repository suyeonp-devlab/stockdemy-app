import Skeleton from "@/shared/components/skeleton/Skeleton";
import React from "react";

export default function DisclosureCardSkeleton() {

  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-3 w-16 mb-1.5" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}