"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useGetJournalListQuery } from "@/features/journal/journal.query";
import FilterTabs from "@/shared/components/tab/FilterTabs";
import JournalListSkeleton from "@/features/journal/skeleton/JournalListSkeleton";
import { JournalRequest } from "@/features/journal/journal.type";
import { useGetCommonCodesQuery } from "@/shared/common-code/common-code.query";
import { toFilterOptions } from "@/shared/utils/view";
import FilterSkeleton from "@/features/journal/skeleton/FilterSkeleton";
import Button from "@/shared/components/button/Button";
import JournalCard from "@/features/journal/components/JournalCard";
import Pagination from "@/shared/components/pagination/Pagination";

const PAGE_SIZE = 10;

interface JournalListViewProps {
  onWriteNew: () => void;
  onEdit: (id: string) => void;
}

export default function JournalListView({ onWriteNew, onEdit }: JournalListViewProps) {

  // 주식 일지 조회 조건
  const [searchQuery, setSearchQuery] = useState<JournalRequest>({
    status: "", page: 1, pageSize: PAGE_SIZE
  });

  // 조회 조건 변경 → 스크롤 최상단 이동
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [searchQuery]);

  const { data: journalStatuses, isLoading: isStatusesLoading } = useGetCommonCodesQuery({ groupId: "JOURNAL_STATUS" });
  const { data: journalResponse, isLoading } = useGetJournalListQuery(searchQuery);

  const statuses = journalStatuses?.items ?? [];
  const journals = journalResponse?.items ?? [];

  // 주식 일지 조회 조건 변경 (단일필드)
  const handleSearchChange = <K extends keyof JournalRequest>(key: K, value: JournalRequest[K]) => {
    setSearchQuery((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setSearchQuery((prev) => ({ ...prev, page }));
  };

  return (
    <div>
      {/* 필터 */}
      <div className="flex md:justify-end mb-6">
        {isStatusesLoading ?
         <FilterSkeleton /> :
         <FilterTabs
           options={toFilterOptions(statuses)}
           value={searchQuery.status}
           onChange={(value) => handleSearchChange("status", value)}
           variant="sub"
           className="-mx-6 px-6"
         />
        }
      </div>

      {/* 조회중 */}
      {isLoading && <JournalListSkeleton />}

      {/* 미존재 */}
      {!isLoading && journals.length === 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-md p-16 text-center">
          <p className="text-sm md:text-base font-medium text-gray-400 mb-2">
            조건에 맞는 주식 일지가 존재하지 않습니다.
          </p>
          <p className="text-xs md:text-sm text-gray-500 mb-5">
            매매 기록을 남기고 AI 복기 분석을 받아보세요.
          </p>
          <Button className="inline-flex items-center gap-2 justify-center" onClick={onWriteNew}>
            <Plus className="w-4 h-4" />
            일지 작성하기
          </Button>
        </div>
      )}

      {/* 존재 */}
      {!isLoading && journals.length > 0 && (
        <div>
          <div className="divide-y divide-gray-800/50">
            {journals.map(journal => <JournalCard key={journal.id} journal={journal} onEdit={onEdit} />)}
          </div>
          <Pagination page={searchQuery.page} totalPages={journalResponse?.totalPages ?? 1} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}