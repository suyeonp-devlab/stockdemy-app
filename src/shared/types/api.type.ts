// 서버 응답 공통 포맷
export interface ApiResponse<T> {
  success: boolean;   // 성공여부
  code: string;       // 코드
  message: string;    // 메세지
  data: T | null;     // 데이터
}

// API 요청 부가설정
export interface ApiRequestMeta {
  timeout?: number;           // 타임아웃 개별 설정
  skipErrorAlert?: boolean;   // 에러 alert 표출 제어
  skipAuthRefresh?: boolean;  // 토큰 갱신 시도 제어
}
