import React from "react";
import { useGetDisclosureListQuery } from "@/features/stock/stock.query";
import DisclosureCardSkeleton from "@/features/stock/skeleton/DisclosureCardSkeleton";
import DisclosureRow from "@/features/stock/components/DisclosureRow";

export default function DisclosureCard() {

  const { data: disclosures = [], isLoading } = useGetDisclosureListQuery();

  // 조회중
  if (isLoading) return <DisclosureCardSkeleton />

  return (
    <div className="bg-gray-900 rounded-md md:border md:border-gray-800 pt-3 md:p-5">
      <h3 className="hidden md:block text-sm font-semibold text-gray-100 mb-4">오늘의 공시</h3>

      {disclosures.length === 0 && (
        <p className="text-sm text-gray-500">오늘의 공시가 없습니다.</p>
      )}

      {disclosures.length > 0 && disclosures.map((disclosure) => (
        <DisclosureRow key={disclosure.receiptNo} disclosure={disclosure} />
      ))}
    </div>
  );
}