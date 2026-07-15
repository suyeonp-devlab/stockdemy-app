import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function Input({
  error,
  className,
  spellCheck = false,
  ...props
}: InputProps) {

  return (
    <input
      spellCheck={spellCheck}
      data-gramm="false"
      data-gramm_editor="false"
      data-enable-grammarly="false"
      className={clsx(
        "w-full px-4 py-3 rounded-md border bg-gray-800 text-sm text-gray-100 placeholder-gray-600 focus:outline-none transition-colors",
        error ? "border-red-500 focus:border-red-400" : "border-gray-700 focus:border-blue-400",
        "disabled:bg-gray-900 disabled:text-gray-500 disabled:border-gray-800 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}
