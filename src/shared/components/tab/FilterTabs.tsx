"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

type FilterVariant = "primary" | "sub";

export interface FilterTabOption {
  label: string;
  value: string;
  subLabel?: string;
}

interface FilterTabsProps {
  options: FilterTabOption[];
  value: string;
  onChange: (value: string) => void;
  variant?: FilterVariant;
  className?: string;
}

export default function FilterTabs({
  options,
  value,
  onChange,
  variant = "primary",
  className
}: FilterTabsProps) {

  // 선택된 버튼이 가로 스크롤 밖에 위치해 있으면 보이는 위치로 이동
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [value]);

  return (
    <div className={clsx("flex gap-2 flex-nowrap overflow-x-auto scrollbar-hide scroll-fade-mask pb-1", className)}>
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            ref={isActive ? activeRef : undefined}
            onClick={() => onChange(option.value)}
            className={clsx(
              "whitespace-nowrap transition-colors flex items-center gap-1",
              optionStyles[variant],
              isActive ? stateStyles[variant].active : stateStyles[variant].inactive
            )}
          >
            {option.label}
            {option.subLabel && <span className="text-xs text-gray-600">{option.subLabel}</span>}
          </button>
        );
      })}
    </div>
  );
}

// 필터 유형에 따른 옵션 스타일
const optionStyles: Record<FilterVariant, string> = {
  primary: "px-4 py-3 text-sm font-medium rounded-md",
  sub: "px-3 py-2.5 text-sm font-medium rounded-md",
};

// 필터 유형에 따른 활성상태 스타일
const stateStyles: Record<FilterVariant, { active: string; inactive: string }> = {
  primary: {
    active: "bg-blue-500 text-white",
    inactive: "bg-gray-800 text-gray-400 border border-gray-700 hover:text-white",
  },
  sub: {
    active: "bg-blue-500/15 text-blue-400 border border-blue-500/40",
    inactive: "text-gray-500 border border-gray-800 hover:text-gray-300",
  },
};
