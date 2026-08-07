type OverlayBridgeHandlers = {
  alert: (message: string) => Promise<void>;
  showLoading: () => void;
  hideLoading: () => void;
};

let handlers: OverlayBridgeHandlers | null = null;

// 동시 api 요청 수 추적 (마지막 요청이 끝날 때만 로딩 해제)
let loadingCount = 0;

/**
 * React 외부에서 overlay 함수를 사용하기 위한 브릿지
 * axios 인터셉터, useAppQuery, useAppMutation 등에서 사용
 */
export const overlayBridge = {

  register(nextHandlers: OverlayBridgeHandlers) {
    handlers = nextHandlers;
  },

  alert: (message: string) => handlers?.alert(message),

  showLoading: () => {
    loadingCount++;
    if (loadingCount === 1) handlers?.showLoading();
  },

  hideLoading: () => {
    loadingCount = Math.max(0, loadingCount - 1);
    if (loadingCount === 0) handlers?.hideLoading();
  },
};
