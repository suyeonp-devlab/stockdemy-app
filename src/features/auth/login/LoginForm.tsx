"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/shared/components/button/Button";
import Checkbox from "@/shared/components/form/Checkbox";
import FormField from "@/shared/components/form/FormField";
import Input from "@/shared/components/form/Input";
import { useAuthStore } from "@/shared/store/auth.store";
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from "@/shared/utils/storage";
import { isSafeReturnUrl } from "@/features/auth/auth.lib";
import { useGoogleLoginMutation, useLoginMutation } from "@/features/auth/login/login.query";
import { LOGIN_SCHEMA, LOGIN_SCHEMA_TYPE } from "@/features/auth/login/login.schema";

const REMEMBERED_EMAIL_KEY = "rememberedEmail";
const LAST_LOGIN_METHOD_KEY = "lastLoginMethod";

type LoginMethod = "email" | "google";

export default function LoginForm() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const returnUrl = searchParams.get("returnUrl");
  const redirectTo = isSafeReturnUrl(returnUrl) ? returnUrl : "/";

  const rememberedEmail = getLocalStorageItem(REMEMBERED_EMAIL_KEY);
  const lastLoginMethod = getLocalStorageItem(LAST_LOGIN_METHOD_KEY) as LoginMethod | null;

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

  // 아이디 저장 → 로그인 성공/실패 여부와 무관하게 실행
  const saveRememberedEmail = (email: string) => {
    if (rememberId) setLocalStorageItem(REMEMBERED_EMAIL_KEY, email);
    else removeLocalStorageItem(REMEMBERED_EMAIL_KEY);
  };

  // 로그인
  const handleLogin = async (data: LOGIN_SCHEMA_TYPE) => {
    saveRememberedEmail(data.email);
    const result = await login(data);
    setAccessToken(result.accessToken);
    void queryClient.invalidateQueries();
    setLocalStorageItem(LAST_LOGIN_METHOD_KEY, "email");
    router.replace(redirectTo);
  };

  // 구글 로그인
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const result = await googleLogin({ accessToken: tokenResponse.access_token });
      setAccessToken(result.accessToken);
      void queryClient.invalidateQueries();
      setLocalStorageItem(LAST_LOGIN_METHOD_KEY, "google");
      router.replace(redirectTo);
    },
  });

  return (
    <div className="w-full">
      <div className="text-center md:text-left mb-4">
        <h2 className="text-2xl font-bold text-gray-100">로그인</h2>
      </div>

      <form onSubmit={handleSubmit(handleLogin)} noValidate>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          {/* Google 로그인 */}
          <div className="relative mb-6">
            <Button
              type="button"
              onClick={() => handleGoogleLogin()}
              width="full"
              className="flex items-center justify-center gap-3 border font-medium py-3"
              style={{ backgroundColor: "#131314", borderColor: "#8E918F", color: "#E3E3E3" }}
            >
              <FcGoogle className="w-5 h-5 shrink-0" />
              Google로 로그인
            </Button>
            {lastLoginMethod === "google" && (
              <span className="absolute -top-2 -right-2 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-xl shadow">
                최근 로그인
              </span>
            )}
          </div>

          {/* 구분선 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-xs text-gray-600">또는</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* 기본 로그인 */}
          <FormField label="이메일" error={errors.email?.message} className="mb-4">
            <Input
              type="email"
              placeholder="이메일을 입력하세요"
              error={!!errors.email}
              {...register("email")}
            />
          </FormField>

          <FormField label="비밀번호" error={errors.password?.message} className="mb-4">
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              error={!!errors.password}
              {...register("password")}
            />
          </FormField>

          <Checkbox
            label="아이디 저장"
            checked={rememberId}
            onChange={(e) => setRememberId(e.target.checked)}
            className="mb-8"
          />

          <Button type="submit" disabled={isSubmitting} variant="primary" width="full">
            로그인
          </Button>
        </div>
      </form>

      <div className="flex items-center justify-center gap-2.5 mt-6 text-sm">
        <Link href="/reset-password" className="font-semibold text-gray-400 hover:underline">
          비밀번호 찾기
        </Link>
        <span className="w-px h-3 bg-gray-500" />
        <Link href="/signup" className="font-semibold text-blue-400 hover:underline">
          회원가입
        </Link>
      </div>
    </div>
  );
}
