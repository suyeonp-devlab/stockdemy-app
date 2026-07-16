import type { InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import clsx from "clsx";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export default function Checkbox({
  label,
  className,
  ...props
}: CheckboxProps) {

  return (
    <label className={clsx("inline-flex items-center gap-2 cursor-pointer select-none", className)}>
      <span className="relative inline-flex w-4 h-4 shrink-0 items-center justify-center">
        <input type="checkbox" className="peer sr-only" {...props} />
        <span
          className={clsx(
            "absolute inset-0 rounded border transition-colors",
            "border-gray-700 bg-gray-800",
            "peer-checked:bg-blue-500 peer-checked:border-blue-500",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400 peer-focus-visible:ring-offset-0",
            "peer-disabled:bg-gray-900 peer-disabled:border-gray-800 peer-disabled:cursor-not-allowed",
          )}
        />
        <Check
          className="relative w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
          strokeWidth={4}
        />
      </span>
      {label && <span className="text-sm text-gray-300">{label}</span>}
    </label>
  );
}
