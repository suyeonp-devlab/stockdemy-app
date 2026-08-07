import { z } from "zod";

// 비밀번호 변경 폼 스키마
export const CHANGE_PASSWORD_SCHEMA = z.object({
  currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요."),
  newPassword: z.string()
    .min(8, "비밀번호는 8자 이상 입력해주세요.")
    .regex(/[a-zA-Z]/, "비밀번호는 영문을 포함해야 합니다")
    .regex(/[0-9]/, "비밀번호는 숫자를 포함해야 합니다"),
  newPasswordConfirm: z.string(),
})
.refine((data) => data.newPassword.length < 8 || data.newPassword === data.newPasswordConfirm, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["newPasswordConfirm"],
});

export type CHANGE_PASSWORD_SCHEMA_TYPE = z.infer<typeof CHANGE_PASSWORD_SCHEMA>;
