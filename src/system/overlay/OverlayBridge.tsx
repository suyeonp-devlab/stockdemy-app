"use client";

import { useEffect } from "react";
import { useOverlay } from "@/system/overlay/useOverlay";
import { overlayBridge } from "@/shared/lib/overlay-bridge";

/**
 * React Context(useOverlay)의 overlay 함수를 React 외부(axios 등)에서 사용할 수 있도록
 * overlayBridge에 등록하는 브릿지 컴포넌트
 * */
export default function OverlayBridge() {

  const { alert, showLoading, hideLoading } = useOverlay();

  useEffect(() => {
    overlayBridge.register({ alert, showLoading, hideLoading });
  }, [alert, showLoading, hideLoading]);

  return null;
}
