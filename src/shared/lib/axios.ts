import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { overlayBridge } from "@/system/overlay/overlay-bridge";
import { ApiRequestMeta, ApiResponse } from "@/shared/types/api.type";
import { useAuthStore } from "@/shared/store/auth.store";
import { getQueryClient } from "@/shared/lib/query-client";

declare module "axios" {
  interface AxiosRequestConfig { meta?: ApiRequestMeta; }
  interface InternalAxiosRequestConfig {
    meta?: ApiRequestMeta;
    _retry?: boolean;
  }
}

// refresh 진행상태 (null이 아닌 경우 → refresh 진행중)
let refreshPromise: Promise<void> | null = null;

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
  withCredentials: true,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    // 타임아웃 개별 설정
    if (config.meta?.timeout !== undefined) {
      config.timeout = config.meta.timeout;
    }

    // token 세팅
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {

    const originalRequest = error.config as InternalAxiosRequestConfig | undefined;
    const status = error.response?.status;

    // refresh 시도 조건
    // 1) 401 에러
    // 2) 기존 요청 정보 존재
    // 3) refresh 시도하지 않은 요청
    // 4) refresh 제외 요청이 아닐 것
    // 5) 현재 세션에서 refresh 실패한 적 없을 것
    const shouldRefresh =
      status === 401 &&
      !!originalRequest &&
      !originalRequest._retry &&
      !originalRequest.meta?.skipAuthRefresh &&
      !useAuthStore.getState().sessionExpired;

    if (shouldRefresh) {
      originalRequest._retry = true;

      try {
        // refresh 중복 호출 방지
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => refreshPromise = null);
        }

        await refreshPromise;
        return axiosInstance.request(originalRequest);

      } catch {
        // refresh 실패 → 세션 만료로 간주
        useAuthStore.getState().logout();
        void getQueryClient().invalidateQueries();
        return Promise.reject(error);
      }
    }

    if (!originalRequest?.meta?.skipErrorAlert) {
      const data = error.response?.data as ApiResponse<unknown>;
      const message = data?.message ?? "일시적인 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.";
      overlayBridge.alert(message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

/** 공통 API 요청 함수 (nullable) */
export const request = async <T>(config: AxiosRequestConfig): Promise<T | null> => {
  const response = await axiosInstance.request<ApiResponse<T>>(config);
  return response.data.data;
};

/** 공통 API 요청 함수 (data 필수) */
export const requestRequired = async <T>(config: AxiosRequestConfig): Promise<T> => {

  const response = await axiosInstance.request<ApiResponse<T>>(config);

  if (response.data.data === null) {
    overlayBridge.alert("응답 데이터가 올바르지 않습니다.");
    throw new Error("ApiResponse.data is null");
  }

  return response.data.data;
};

// 토큰 갱신 api
const refreshAccessToken = async (): Promise<void> => {

  const token = await request<string>({ method: "POST", url: "/api/auth/refresh", meta:
    { skipAuthRefresh: true, skipErrorAlert: true }
  });

  if (!token) throw new Error("accessToken is null");
  useAuthStore.getState().setAccessToken(token);
};