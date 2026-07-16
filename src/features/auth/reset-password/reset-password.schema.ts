import { z } from "zod";

// 비밀번호 재설정 폼 스키마
export const RESET_PASSWORD_SCHEMA = z.object({
  email: z.string().trim()
    .min(1, { message: "이메일을 입력해주세요." })
    .pipe(z.email({ message: "올바른 이메일 형식이 아닙니다." })),
  password: z.string()
    .min(8, "비밀번호는 8자 이상 입력해주세요.")
    .regex(/[a-zA-Z]/, "비밀번호는 영문을 포함해야 합니다")
    .regex(/[0-9]/, "비밀번호는 숫자를 포함해야 합니다"),
  passwordConfirm: z.string(),
  code: z.string().regex(/^\d{6}$/, "인증코드 6자리를 입력해주세요"),
})
.refine((data) => data.password.length < 8 || data.password === data.passwordConfirm, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["passwordConfirm"],
});

export type RESET_PASSWORD_SCHEMA_TYPE = z.infer<typeof RESET_PASSWORD_SCHEMA>;
