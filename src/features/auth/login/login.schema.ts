import { z } from "zod";

// 로그인 폼 스키마
export const LOGIN_SCHEMA = z.object({
  email: z.string().trim()
    .min(1, { message: "이메일을 입력해주세요." })
    .pipe(z.email({ message: "올바른 이메일 형식이 아닙니다." })),
  password: z.string()
    .min(1, "비밀번호를 입력해주세요."),
});

export type LOGIN_SCHEMA_TYPE = z.infer<typeof LOGIN_SCHEMA>;
