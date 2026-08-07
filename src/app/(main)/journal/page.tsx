import type { Metadata } from "next";
import JournalPage from "@/features/journal/JournalPage";
import ProtectedRoute from "@/system/auth/ProtectedRoute";

export const metadata: Metadata = { title: "주식 일지" };

export default function JournalRoutePage() {

  return (
    <ProtectedRoute>
      <JournalPage />
    </ProtectedRoute>
  );
}
