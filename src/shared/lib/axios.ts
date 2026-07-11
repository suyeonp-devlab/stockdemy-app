import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { overlayBridge } from "@/shared/lib/overlay-bridge";
import { ApiRequestMeta, ApiResponse } from "@/shared/types/api.type";

declare module "axios" {
  interface AxiosRequestConfig { meta?: ApiRequestMeta; }
  interface InternalAxiosRequestConfig {
    meta?: ApiRequestMeta;
    _retry?: boolean;
  }
}

// accessToken 메모리 보관
let accessToken: string | null = null;

// accessToken 메모리 세팅
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

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
    // - 401 에러일 것
    // - 기존 요청 정보가 존재할 것
    // - 아직 refresh를 시도하지 않은 요청일 것
    // - refresh 제외 요청이 아닐 것
    const shouldRefresh =
      status === 401 &&
      !!originalRequest &&
      !originalRequest._retry &&
      !originalRequest.meta?.skipAuthRefresh;

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
        // refresh 실패 → 세션 만료로 간주 (로그인 페이지로 이동)
        accessToken = null;
        if (typeof window !== "undefined") window.location.href = "/login";
        return new Promise<never>(() => {});
      }
    }

    if (!originalRequest?.meta?.skipErrorAlert) {
      const data = error.response?.data as ApiResponse<unknown>;
      const message = data?.message ?? "알 수 없는 오류가 발생했습니다.";
      overlayBridge.alert(message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

/**
 * 공통 API 요청 함수 (nullable)
 * 서버 응답의 data를 그대로 반환 → 성공이더라도 data가 null일 수 있는 API에서 사용한다.
 */
export const request = async <T>(config: AxiosRequestConfig): Promise<T | null> => {
  const response = await axiosInstance.request<ApiResponse<T>>(config);
  return response.data.data;
};

/**
 * 공통 API 요청 함수 (data 필수)
 * 서버 응답의 data가 반드시 존재해야 하는 API 사용 → data가 null인 경우 비정상 응답으로 간주하고 에러를 발생시킨다.
 */
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

  const token = await request<string>({ method: "POST", url: "/api/auth/refresh", meta: {
      skipAuthRefresh: true, skipErrorAlert: true
    }});

  if (!token) throw new Error("accessToken is null");
  accessToken = token;
};