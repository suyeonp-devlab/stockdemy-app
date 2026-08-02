"use client";

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

// 버튼 유형: primary (주요 버튼), secondary (보조 버튼)
type ButtonVariant = "primary" | "secondary";

// 버튼 너비
type ButtonWidth = "sm" | "md" | "lg" | "full";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  width?: ButtonWidth;
}

export default function Button({
  variant = "primary",
  width = "md",
  className,
  children,
  ...props
}: ButtonProps) {

  return (
    <button
      className={clsx(
        "py-2.5 text-sm font-semibold rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        variantStyles[variant],
        widthStyles[width],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 버튼 유형에 따른 스타일
const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  secondary: "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700",
};

// 버튼 너비에 따른 스타일
const widthStyles: Record<ButtonWidth, string> = {
  sm: "w-20",
  md: "w-32",
  lg: "w-70",
  full: "w-full",
};