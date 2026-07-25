import clsx from "clsx";

export interface UnderlineTabOption {
  label: string;
  value: string;
}

interface UnderlineTabProps {
  options: UnderlineTabOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function UnderlineTab({
  options,
  value,
  onChange,
  className
}: UnderlineTabProps) {

  return (
    <div className={clsx("flex border-b border-gray-800 mb-6", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={clsx(
            "flex-1 py-1.5 text-sm md:text-base font-medium border-b-2 -mb-px transition-colors",
            option.value === value ? "border-blue-500 text-gray-100" : "border-transparent text-gray-500"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}