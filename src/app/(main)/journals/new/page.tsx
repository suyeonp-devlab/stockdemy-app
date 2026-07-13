import JournalFormPage from "@/features/journals/JournalFormPage";
import ProtectedRoute from "@/system/auth/ProtectedRoute";

export default function NewJournalPage() {
  return (
    <ProtectedRoute>
      <JournalFormPage />
    </ProtectedRoute>
  );
}
