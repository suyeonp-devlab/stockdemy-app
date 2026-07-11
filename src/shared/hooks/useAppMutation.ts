"use client";

import {
  DefaultError,
  UseMutationOptions,
  UseMutationResult,
  useMutation,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { overlayBridge } from "@/system/overlay/overlay-bridge";

type UseAppMutationOptions<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
> = UseMutationOptions<TData, TError, TVariables, TContext> & {
  loading?: boolean;
};

/** 공통 loading 처리가 적용된 mutation 래퍼 hook */
export function useAppMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(
  options: UseAppMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {

  // 로딩 기본값: 표출
  const { loading = true, ...mutationOptions } = options;

  const result = useMutation<TData, TError, TVariables, TContext>(mutationOptions);

  useEffect(() => {
    if (!loading || !result.isPending) return;
    overlayBridge.showLoading();
    return () => { overlayBridge.hideLoading(); };
  }, [loading, result.isPending]);

  return result;
}
