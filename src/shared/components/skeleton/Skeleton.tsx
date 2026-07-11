import type { CSSProperties } from "react";
import clsx from "clsx";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export default function Skeleton({ className, style }: SkeletonProps) {
  return <div className={clsx("animate-pulse bg-gray-800 rounded-md", className)} style={style} />;
}
