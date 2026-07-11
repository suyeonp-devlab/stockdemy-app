"use client";

import {
  DefaultError,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { overlayBridge } from "@/system/overlay/overlay-bridge";

type UseAppQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
  loading?: boolean;
};

/** 공통 loading 처리가 적용된 query 래퍼 hook */
export function useAppQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseAppQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> {

  // 로딩 기본값: 미표출
  const { loading = false, ...queryOptions } = options;

  const result = useQuery<TQueryFnData, TError, TData, TQueryKey>(queryOptions);

  useEffect(() => {
    // 백그라운드 리패치(isFetching) 상태 → 로딩 미표출
    if (!loading || !result.isLoading) return;
    overlayBridge.showLoading();
    return () => { overlayBridge.hideLoading(); };
  }, [loading, result.isLoading]);

  return result;
}
