"use client";

import Button from "@/shared/components/button/Button";

interface ConfirmProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Confirm({ message, onConfirm, onCancel }: ConfirmProps) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-xl bg-gray-900 border border-gray-800 p-6 shadow-2xl animate-fadein">
        <p className="text-sm text-gray-200 leading-relaxed text-center whitespace-pre-line">
          {message}
        </p>

        <div className="mt-6 flex gap-3">
          <Button variant="secondary" width="full" onClick={onCancel}>
            취소
          </Button>
          <Button variant="primary" width="full" onClick={onConfirm}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
