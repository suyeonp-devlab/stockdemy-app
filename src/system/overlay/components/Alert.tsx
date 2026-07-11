"use client";

import Button from "@/shared/components/button/Button";

interface AlertProps {
  message: string;
  onClose: () => void;
}

export default function Alert({ message, onClose }: AlertProps) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-xl bg-gray-900 border border-gray-800 p-6 shadow-2xl animate-fadein">
        <p className="text-sm text-gray-200 leading-relaxed text-center whitespace-pre-line">
          {message}
        </p>

        <div className="mt-6 flex justify-center">
          <Button variant="primary" width="full" onClick={onClose}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
