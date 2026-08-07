import { request } from "@/shared/lib/axios";
import { WithdrawRequest } from "@/features/auth/auth.type";

// 회원 탈퇴
export const withdraw = async (data: WithdrawRequest) => {
  await request<void>({ method: "DELETE", url: "/api/users/me", data });
}
