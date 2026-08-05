import { requestRequired } from "@/shared/lib/axios";
import { AuthTokenResponse, ChangePasswordRequest } from "@/features/auth/auth.type";

// 비밀번호 변경
export const changePassword = async (data: ChangePasswordRequest) => {
  return requestRequired<AuthTokenResponse>({ method: "PUT", url: "/api/users/me/password", data });
}
