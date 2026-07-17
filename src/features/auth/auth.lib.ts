const RETURN_URL_PATTERN = /^\/(?!\/)/;

// returnUrl 안전성 검증 → 오픈 리다이렉트 방지
export const isSafeReturnUrl = (returnUrl?: string | null): returnUrl is string => {
  returnUrl ??= "";
  return returnUrl !== "/" && RETURN_URL_PATTERN.test(returnUrl);
};

// 로그인 페이지 경로 생성
export const buildLoginUrl = (returnUrl?: string | null) => {
  returnUrl ??= "";
  return isSafeReturnUrl(returnUrl) ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : "/login";
};