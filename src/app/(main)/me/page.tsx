import type { Metadata } from "next";
import MePage from "@/features/me/MePage";
import ProtectedRoute from "@/system/auth/ProtectedRoute";

export const metadata: Metadata = { title: "마이페이지" };

export default function MeRoutePage() {

  return (
    <ProtectedRoute>
      <MePage />
    </ProtectedRoute>
  );
}
