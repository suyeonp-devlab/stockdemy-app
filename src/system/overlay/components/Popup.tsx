"use client";

import { X } from "lucide-react";
import React from "react";
import IconButton from "@/shared/components/button/IconButton";

interface PopupProps {
  title: string;
  content: React.ReactNode;
  onClose: () => void;
}

export default function Popup({ title, content, onClose }: PopupProps) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div style={{ maxHeight: "75vh" }} className="w-full max-w-lg flex flex-col rounded-xl bg-gray-900 border border-gray-800 shadow-2xl animate-fadein">
        <div className="flex justify-between p-4 pb-0 flex-shrink-0">
          <div className="text-gray-300 self-center truncate">{title}</div>
          <IconButton icon={<X size={20} />} size="md" aria-label="팝업 닫기" onClick={onClose} />
        </div>

        <div className="p-4 pt-2 overflow-y-auto scrollbar-hide">{content}</div>
      </div>
    </div>
  );
}
