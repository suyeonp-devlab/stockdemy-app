interface StockInfoRowProps {
  label: string;
  value: string;
}

export default function StockInfoRow({ label, value }: StockInfoRowProps) {

  return (
    <div className="p-4 rounded-md bg-gray-900">
      <div className="text-xs md:text-sm text-gray-500 font-medium mb-2">{label}</div>
      <div className="text-sm md:text-base font-medium text-gray-100 tabular-nums">{value}</div>
    </div>
  );
}
