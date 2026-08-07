import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

// 버튼 크기
type ButtonSize = "sm" | "md";

// 버튼 선택시 색상
type ButtonSelectedColor = "blue" | "red" | "gray";

interface ToggleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  size?: ButtonSize;
  selectedColor?: ButtonSelectedColor;
}

export default function ToggleButton({
  selected = false,
  size = "md",
  selectedColor = "gray",
  className,
  children,
  ...props
}: ToggleButtonProps) {

  return (
    <button
      type="button"
      className={clsx(
        "rounded-md font-semibold transition-colors border disabled:opacity-50 disabled:pointer-events-none",
        selected ? selectedColorStyles[selectedColor] : "bg-gray-800 text-gray-500 border-transparent hover:border-gray-600",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 버튼 사이즈에 따른 스타일
const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "flex-1 px-4 py-2.5 text-sm border-2"
};

// 버튼 선택시 색상에 따른 스타일
const selectedColorStyles: Record<ButtonSelectedColor, string> = {
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/40",
  red: "bg-red-950 text-red-300 border-red-500",
  gray: "bg-gray-700 text-white border-gray-500"
};
