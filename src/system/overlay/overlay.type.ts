import React from "react";

// alert 상태
export type AlertState = {
  message: string;
  resolve: () => void;
} | null;

// confirm 상태
export type ConfirmState = {
  message: string;
  resolve: (value: boolean) => void;
} | null;

// popup 상태
export type PopupState = {
  content: React.ReactNode;
} | null;