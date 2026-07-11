"use client";

import React, { createContext, PropsWithChildren, useCallback, useMemo, useState } from "react";
import { useBodyScrollLock } from "@/shared/hooks/useBodyScrollLock";
import Alert from "@/system/overlay/components/Alert";
import Confirm from "@/system/overlay/components/Confirm";
import Popup from "@/system/overlay/components/Popup";
import Loading from "@/system/overlay/components/Loading";
import { AlertState, ConfirmState, PopupState } from "@/system/overlay/overlay.type";

type OverlayContextType = {
  alert: (message: string) => Promise<void>;
  confirm: (message: string) => Promise<boolean>;
  openPopup: (content: React.ReactNode) => void;
  closePopup: () => void;
  showLoading: () => void;
  hideLoading: () => void;
};

export const OverlayContext = createContext<OverlayContextType | null>(null);

/** overlay 전역 Provider */
export function OverlayProvider({ children }: PropsWithChildren) {

  const [alertState, setAlertState] = useState<AlertState>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [popupState, setPopupState] = useState<PopupState>(null);
  const [isLoading, setIsLoading] = useState(false);

  // overlay 열려있으면 body 스크롤 잠금
  const isAnyOpen = !!(alertState || confirmState || popupState || isLoading);
  useBodyScrollLock(isAnyOpen);

  // alert 표출
  const alert = useCallback((message: string): Promise<void> => {
    return new Promise((resolve) => {
      setAlertState({ message, resolve });
    });
  }, []);

  // alert 확인 → Promise resolve 후 상태 초기화
  const handleAlertClose = () => {
    alertState?.resolve();
    setAlertState(null);
  };

  // confirm 표출
  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ message, resolve });
    });
  }, []);

  // confirm 확인 → Promise resolve(true) 후 상태 초기화
  const handleConfirm = () => {
    confirmState?.resolve(true);
    setConfirmState(null);
  };

  // confirm 취소 → Promise resolve(false) 후 상태 초기화
  const handleCancel = () => {
    confirmState?.resolve(false);
    setConfirmState(null);
  };

  // popup 표출
  const openPopup = useCallback((content: React.ReactNode) => {
    setPopupState({ content });
  }, []);

  // popup 닫기
  const closePopup = useCallback(() => {
    setPopupState(null);
  }, []);

  // loading 표출
  const showLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  // loading 닫기
  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const value = useMemo<OverlayContextType>(
    () => ({
      alert,
      confirm,
      openPopup,
      closePopup,
      showLoading,
      hideLoading,
    }),
    [alert, confirm, showLoading, hideLoading, openPopup, closePopup]
  );

  return (
    <OverlayContext.Provider value={value}>
      {children}
      {alertState && <Alert message={alertState.message} onClose={handleAlertClose} />}
      {confirmState && <Confirm message={confirmState.message} onConfirm={handleConfirm} onCancel={handleCancel} />}
      {popupState && <Popup content={popupState.content} onClose={closePopup} /> }
      {isLoading && <Loading />}
    </OverlayContext.Provider>
  );
}
