"use client";

import { useEffect, useState } from "react";
import UnderlineTab, { UnderlineTabOption } from "@/shared/components/tab/UnderlineTab";
import JournalListView from "@/features/journal/components/JournalListView";
import JournalWriteView from "@/features/journal/components/JournalWriteView";
import { JournalRequest } from "@/features/journal/journal.type";
import { useGetJournalListQuery } from "@/features/journal/journal.query";

const PAGE_SIZE = 10;

type Tab = "LIST" | "WRITE";

export default function JournalPage() {

  // 선택한 탭
  const [tab, setTab] = useState<Tab>("LIST");

  // 수정 중인 주식 일지 id
  const [editId, setEditId] = useState<string | null>(null);

  // 주식 일지 조회 조건
  const initSearchQuery: JournalRequest  = { status: "", page: 1, pageSize: PAGE_SIZE };
  const [searchQuery, setSearchQuery] = useState<JournalRequest>(initSearchQuery);

  const { data: journalResponse } = useGetJournalListQuery(searchQuery);

  // 탭 변경 또는 조회 조건 변경 → 스크롤 최상단 이동
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tab, searchQuery]);

  // 주식 일지 조회 조건 변경 (단일필드)
  const handleSearchChange = <K extends keyof JournalRequest>(key: K, value: JournalRequest[K]) => {
    setSearchQuery((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setSearchQuery((prev) => ({ ...prev, page }));
  };

  // 탭 전환
  const handleTabChange = (value: string) => {
    if (value === "WRITE") setEditId(null);
    setTab(value as Tab);
  };

  // 리스트 → 수정 진입
  const handleEdit = (id: string) => {
    setEditId(id);
    setTab("WRITE");
  };

  // 작성/수정 완료 → 목록 진입
  const handleDone = (keepSearchQuery: boolean) => {
    if (!keepSearchQuery) setSearchQuery(initSearchQuery);
    setEditId(null);
    setTab("LIST");
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-2">주식 일지</h1>
        <p className="text-sm text-gray-400">나의 매수·매도 기록과 AI 복기 분석을 확인해보세요.</p>
      </div>

      {/* 밑줄 탭 */}
      <UnderlineTab options={TABS} value={tab} onChange={handleTabChange} />

      {/* 주식 일지 목록 */}
      <JournalListView
        onWriteNew={() => handleTabChange("WRITE")}
        onEdit={handleEdit}
        journalResponse={journalResponse}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onPageChange={handlePageChange}
        className={tab === "LIST" ? "block" : "hidden"}
      />

      {/* 주식 일지 등록 및 수정 */}
      {tab === "WRITE" && <JournalWriteView editId={editId} onDone={handleDone} />}
    </div>
  );
}

// 탭 종류
const TABS: UnderlineTabOption[] = [
  { value: "LIST", label: "일지 목록" },
  { value: "WRITE", label: "일지 작성" },
];