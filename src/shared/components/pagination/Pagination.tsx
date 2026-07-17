"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import IconButton from "@/shared/components/button/IconButton";

interface PaginationProps {
  page: number;
  blockSize?: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  page,
  blockSize = 10,
  totalPages,
  onPageChange,
  className
}: PaginationProps) {

  // 요청 페이지가 총페이지보다 클 경우 → 마지막 페이지로 재조회
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) onPageChange(totalPages);
  }, [page, totalPages, onPageChange]);

  if (totalPages <= 1) return null;

  // 페이지 번호 목록 계산
  const currentBlock = Math.ceil(page / blockSize);
  const start = (currentBlock - 1) * blockSize + 1;
  const end = Math.min(start + blockSize - 1, totalPages);
  const pageNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className={clsx("flex items-center justify-center mt-6 gap-1", className)}>
      <IconButton
        icon={<ChevronLeft className="w-4 h-4" />}
        size="md"
        aria-label="이전 페이지"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      />

      {pageNumbers.map((n) => (
        <IconButton
          key={n}
          icon={n}
          size="md"
          className={clsx("text-sm", n === page && "bg-blue-500 hover:!bg-blue-500")}
          onClick={() => onPageChange(n)}
        />
      ))}

      <IconButton
        icon={<ChevronRight className="w-4 h-4" />}
        size="md"
        aria-label="다음 페이지"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      />
    </div>
  );
}