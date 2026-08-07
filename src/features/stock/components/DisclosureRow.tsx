import React from "react";
import { FileText } from "lucide-react";
import { Disclosure } from "@/features/stock/stock.type";

interface DisclosureRowProps {
 disclosure: Disclosure;
}

export default function DisclosureRow({ disclosure }: DisclosureRowProps) {

  return (
    <a
      href={disclosure.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-2 w-full text-left hover:bg-gray-800/60 py-1 my-1 last:mb-0 transition-colors"
    >
      <FileText className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-medium text-gray-200 truncate">{disclosure.corpName}</span>
          <span className="text-xs text-gray-600 flex-shrink-0">{disclosure.receivedAt}</span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">{disclosure.reportName}</p>
      </div>
    </a>
  );
}