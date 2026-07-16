"use client";

import clsx from "clsx";

export interface FilterTabOption {
  label: string;
  value: string;
  subLabel?: string;
}

interface FilterTabsProps {
  options: FilterTabOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function FilterTabs({
  options,
  value,
  onChange,
  className
}: FilterTabsProps) {

  return (
    <div className={clsx("flex gap-2 flex-nowrap overflow-x-auto scrollbar-hide scroll-fade-mask pb-1", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={clsx(
            "px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors flex items-center gap-1",
            value === option.value ? "bg-blue-500 text-white" : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white"
          )}
        >
          {option.label}
          {option.subLabel && <span className="text-xs text-gray-600">{option.subLabel}</span>}
        </button>
      ))}
    </div>
  );
}
