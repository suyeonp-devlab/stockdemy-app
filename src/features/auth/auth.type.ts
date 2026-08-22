// 인증코드 발송 request
export interface SendCodeRequest {
  email: string;
}

// 인증코드 검증 request
export interface VerifyCodeRequest {
  email: string;
  code: string;
}

// 회원가입 request
export interface SignupRequest {
  email: string;
  password: string;
  passwordConfirm: string;
}

// 구글 회원가입 및 로그인 request
export interface GoogleAuthRequest {
  accessToken: string;
}

// 로그인 request
export interface LoginRequest {
  email: string;
  password: string;
}

// 비밀번호 재설정 request
export interface ResetPasswordRequest {
  email: string;
  password: string;
  passwordConfirm: string;
}

// 회원 탈퇴 request
export interface WithdrawRequest {
  password: string;
}

// 비밀번호 변경 request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

// 인증 토큰 response
export interface AuthTokenResponse {
  accessToken: string;
}

// 내 정보 response
export interface MeResponse {
  email: string;
  provider: string;
  createdAt: string;
}
