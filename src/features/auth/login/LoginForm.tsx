"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/shared/components/button/Button";
import FormField from "@/shared/components/form/FormField";
import Input from "@/shared/components/form/Input";
import { useAuthStore } from "@/shared/store/auth.store";
import { useGoogleLoginMutation, useLoginMutation } from "@/features/auth/login/login.query";
import { LOGIN_SCHEMA, LOGIN_SCHEMA_TYPE } from "@/features/auth/login/login.schema";

const REMEMBERED_EMAIL_KEY = "rememberedEmail";

/** 로그인 폼 */
export default function LoginForm() {

  const router = useRouter();

  const rememberedEmail = typeof window !== "undefined" ? localStorage.getItem(REMEMBERED_EMAIL_KEY) : null;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LOGIN_SCHEMA_TYPE>({
    resolver: zodResolver(LOGIN_SCHEMA),
    mode: "onSubmit",
    defaultValues: { email: rememberedEmail ?? "", password: "" },
  });

  // 아이디 저장 여부
  const [rememberId, setRememberId] = useState(!!rememberedEmail);

  const { mutateAsync: login } = useLoginMutation();
  const { mutateAsync: googleLogin } = useGoogleLoginMutation();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  // 아이디 저장 처리 (로그인 성공/실패 여부와 무관하게 실행)
  const saveRememberedEmail = (email: string) => {
    if (rememberId) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }
  };

  // 로그인
  const handleLogin = async (data: LOGIN_SCHEMA_TYPE) => {
    try {
      const result = await login(data);
      setAccessToken(result?.accessToken ?? null);
      router.push("/");
    } finally {
      saveRememberedEmail(data.email);
    }
  };

  // 구글 로그인
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const result = await googleLogin({ accessToken: tokenResponse.access_token });
      setAccessToken(result?.accessToken ?? null);
      router.push("/");
    },
  });

  return (
    <div className="w-full">
      <div className="text-center md:text-left mb-8">
        <h2 className="text-2xl font-bold text-gray-100">로그인</h2>
      </div>

      <form onSubmit={handleSubmit(handleLogin)} noValidate>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          {/* Google 로그인 */}
          <Button
            type="button"
            onClick={() => handleGoogleLogin()}
            width="full"
            className="flex items-center justify-center gap-3 border font-medium mb-6"
            style={{ backgroundColor: "#131314", borderColor: "#8E918F", color: "#E3E3E3" }}
          >
            <FcGoogle className="w-5 h-5 shrink-0" />
            Google로 로그인
          </Button>

          {/* 구분선 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-xs text-gray-600">또는</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* 이메일 */}
          <FormField label="이메일" error={errors.email?.message} className="mb-4">
            <Input
              type="email"
              placeholder="이메일을 입력하세요"
              error={!!errors.email}
              {...register("email")}
            />
          </FormField>

          {/* 비밀번호 */}
          <FormField label="비밀번호" error={errors.password?.message} className="mb-4">
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              error={!!errors.password}
              {...register("password")}
            />
          </FormField>

          {/* 아이디 저장 */}
          <label className="flex items-center gap-2 mb-6 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberId}
              onChange={(e) => setRememberId(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-0 focus:ring-offset-0"
            />
            <span className="text-sm text-gray-400">아이디 저장</span>
          </label>

          {/* 로그인 버튼 */}
          <Button type="submit" disabled={isSubmitting} variant="primary" width="full">
            로그인
          </Button>
        </div>
      </form>

      {/* 하단 링크 */}
      <div className="flex items-center justify-center mt-6">
        <p className="text-sm text-gray-500">
          아직 계정이 없으신가요?
          <Link href="/signup" className="font-semibold text-blue-400 hover:underline ml-1">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
