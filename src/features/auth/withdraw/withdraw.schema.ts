import { z } from "zod";

// 회원 탈퇴 폼 스키마
export const WITHDRAW_SCHEMA = z.object({
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export type WITHDRAW_SCHEMA_TYPE = z.infer<typeof WITHDRAW_SCHEMA>;
