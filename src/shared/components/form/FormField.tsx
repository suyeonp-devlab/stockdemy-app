import type { PropsWithChildren } from "react";

interface FormFieldProps extends PropsWithChildren {
  label: string;
  error?: string;      // 에러 메시지 (에러 시 help 대신 표시)
  help?: string;       // 안내 문구
  className?: string;
}

export default function FormField({
  label,
  error,
  help,
  className,
  children
}: FormFieldProps) {

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-300 mb-2.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-2.5">{error}</p>}
      {!error && help && <p className="text-xs text-blue-400 mt-2.5">{help}</p>}
    </div>
  );
}
