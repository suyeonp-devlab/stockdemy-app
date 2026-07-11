"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

// 아이콘 버튼 크기
type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  size?: IconButtonSize;
}

export default function IconButton({
  icon,
  size = "md",
  className,
  ...props
}: IconButtonProps) {

  return (
    <button
      className={clsx(
        "flex items-center justify-center rounded-md text-gray-300 hover:text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
}

// 버튼 크기에 따른 스타일
const sizeStyles: Record<IconButtonSize, string> = {
  sm: "w-7 h-7",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};