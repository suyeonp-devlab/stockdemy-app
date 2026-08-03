"use client";

import { useEffect, useState } from "react";
import UnderlineTab, { UnderlineTabOption } from "@/shared/components/tab/UnderlineTab";
import JournalListView from "@/features/journal/components/JournalListView";
import JournalWriteView from "@/features/journal/components/JournalWriteView";

type Tab = "LIST" | "WRITE";

export default function JournalPage() {

  // 선택한 탭
  const [tab, setTab] = useState<Tab>("LIST");

  // 탭 변경 → 스크롤 최상단 이동
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tab]);

  // 수정 중인 주식일지 id
  const [editId, setEditId] = useState<string | null>(null);

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
  const handleDone = () => {
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

      {tab === "LIST" && <JournalListView onWriteNew={() => handleTabChange("WRITE")} onEdit={handleEdit} />}
      {tab === "WRITE" && <JournalWriteView editId={editId} onDone={handleDone} />}
    </div>
  );
}

// 탭 종류
const TABS: UnderlineTabOption[] = [
  { value: "LIST", label: "일지 목록" },
  { value: "WRITE", label: "일지 작성" },
];