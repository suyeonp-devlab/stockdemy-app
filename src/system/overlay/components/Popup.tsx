"use client";

import { X } from "lucide-react";
import React from "react";
import IconButton from "@/shared/components/button/IconButton";

interface PopupProps {
  content: React.ReactNode;
  onClose: () => void;
}

/** Popup 모달 래퍼 */
export default function Popup({ content, onClose }: PopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-xl bg-gray-900 border border-gray-800 shadow-2xl animate-fadein">
        <div className="flex justify-end p-4 pb-0">
          <IconButton icon={<X size={20} />} size="md" aria-label="팝업 닫기" onClick={onClose} />
        </div>

        <div className="p-6 pt-2">{content}</div>
      </div>
    </div>
  );
}
