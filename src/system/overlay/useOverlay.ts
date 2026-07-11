"use client";

import { useContext } from "react";
import { OverlayContext } from "@/system/overlay/OverlayProvider";

/**
 * overlay hook
 * @example const { alert, confirm } = useOverlay();
 */
export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlay는 <OverlayProvider> 안에서만 사용할 수 있습니다.");
  return ctx;
}
