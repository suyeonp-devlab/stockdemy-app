"use client";

import { Plus } from "lucide-react";
import FilterTabs from "@/shared/components/tab/FilterTabs";
import JournalListSkeleton from "@/features/journal/skeleton/JournalListSkeleton";
import { JournalRequest, JournalResponse } from "@/features/journal/journal.type";
import { useGetCommonCodesQuery } from "@/shared/code/code.query";
import { toFilterOptions } from "@/shared/utils/view";
import FilterSkeleton from "@/features/journal/skeleton/FilterSkeleton";
import Button from "@/shared/components/button/Button";
import JournalCard from "@/features/journal/components/JournalCard";
import Pagination from "@/shared/components/pagination/Pagination";

interface JournalListViewProps {
  onWriteNew: () => void;
  onEdit: (id: string) => void;
  journalResponse?: JournalResponse;
  searchQuery: JournalRequest;
  onSearchChange: <K extends keyof JournalRequest>(key: K, value: JournalRequest[K]) => void;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function JournalListView({
  onWriteNew,
  onEdit,
  journalResponse,
  searchQuery,
  onSearchChange,
  onPageChange,
  className
}: JournalListViewProps) {

  const isLoading = !journalResponse;
  const journals = journalResponse?.items ?? [];

  const { data: journalStatuses, isLoading: isStatusesLoading } = useGetCommonCodesQuery({ groupId: "JOURNAL_STATUS" });
  const statuses = journalStatuses?.codes ?? [];

  return (
    <div className={className}>
      {/* 필터 */}
      <div className ="flex md:justify-end mb-6">
        {isStatusesLoading ?
         <FilterSkeleton /> :
         <FilterTabs
           options={toFilterOptions(statuses)}
           value={searchQuery.status}
           onChange={(value) => onSearchChange("status", value)}
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
          <Pagination page={searchQuery.page} totalPages={journalResponse?.totalPages ?? 1} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}