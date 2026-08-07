"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useAuthStore } from "@/shared/store/auth.store";
import Button from "@/shared/components/button/Button";
import FormField from "@/shared/components/form/FormField";
import Input from "@/shared/components/form/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGoogleSignupMutation,
  useSendSignupCodeMutation,
  useSignupMutation,
  useVerifySignupCodeMutation
} from "@/features/auth/signup/signup.query";
import { SIGNUP_SCHEMA, SIGNUP_SCHEMA_TYPE } from "@/features/auth/signup/signup.schema";
import { useOverlay } from "@/system/overlay/useOverlay";

type EmailStep = "input" | "sent" | "verified";

export default function SignupForm() {

  const router = useRouter();
  const { alert } = useOverlay();
  const queryClient = useQueryClient();

  const { register, handleSubmit, getValues, trigger, formState: { errors, isSubmitting } } = useForm<SIGNUP_SCHEMA_TYPE>({
    resolver: zodResolver(SIGNUP_SCHEMA),
    mode: "onSubmit",
    defaultValues: { email: "", password: "", passwordConfirm: "", code: "" },
  });

  // 이메일 인증 단계
  const [emailStep, setEmailStep] = useState<EmailStep>("input");

  const { mutateAsync: sendCode, isPending: isSending } = useSendSignupCodeMutation();
  const { mutateAsync: verifyCode, isPending: isVerifying } = useVerifySignupCodeMutation();
  const { mutateAsync: signup } = useSignupMutation();
  const { mutateAsync: googleSignup } = useGoogleSignupMutation();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  // 인증코드 발송
  const handleSendCode = async () => {

    const isValid = await trigger("email");
    if (!isValid) return;

    await sendCode({ email: getValues("email") });
    setEmailStep("sent");
  };

  // 인증코드 검증
  const handleVerifyCode = async () => {

    const isValid = await trigger("code");
    if (!isValid) return;

    await verifyCode({ email: getValues("email"), code: getValues("code") });
    setEmailStep("verified")
  };

  // 회원가입
  const handleSignup = async (data: SIGNUP_SCHEMA_TYPE) => {
    const result = await signup(data);
    await alert("회원가입이 완료되었습니다.");
    setAccessToken(result.accessToken);
    void queryClient.invalidateQueries();
    router.replace("/");
  };

  // 구글 회원가입
  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const result = await googleSignup({ accessToken: tokenResponse.access_token });
      await alert("회원가입이 완료되었습니다.");
      setAccessToken(result.accessToken);
      void queryClient.invalidateQueries();
      router.replace("/");
    },
  });

  return (
    <div className="w-full">
      <div className="text-center md:text-left mb-4">
        <h2 className="text-2xl font-bold text-gray-100">회원가입</h2>
      </div>

      <form onSubmit={handleSubmit(handleSignup)} noValidate>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          {/* Google 회원가입 */}
          <Button
            type="button"
            onClick={() => handleGoogleSignup()}
            width="full"
            className="flex items-center justify-center gap-3 border font-medium mb-6 py-3"
            style={{ backgroundColor: "#131314", borderColor: "#8E918F", color: "#E3E3E3" }}
          >
            <FcGoogle className="w-5 h-5 shrink-0" />
            Google로 회원가입
          </Button>

          {/* 구분선 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-xs text-gray-600">또는</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* 기본 회원가입 */}
          <FormField
            label="이메일"
            error={errors.email?.message}
            className="mb-4"
            help={emailStep === "sent" ? "인증코드가 전송되었습니다. 5분 내로 입력해 주세요." : ""}
          >
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1 min-w-0">
                <Input
                  type="email"
                  placeholder="이메일을 입력하세요"
                  error={!!errors.email}
                  disabled={emailStep !== "input"}
                  className={emailStep === "verified" ? "pr-24" : undefined}
                  {...register("email")}
                />
                {emailStep === "verified" && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-blue-400 font-medium whitespace-nowrap">
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    인증완료
                  </span>
                )}
              </div>
              {emailStep === "input" && (
                <Button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isSending}
                  variant="primary"
                  width="full"
                  className="md:w-32 whitespace-nowrap"
                >
                  인증코드 발송
                </Button>
              )}
            </div>
          </FormField>

          {emailStep === "sent" && (
            <FormField label="인증코드" error={errors.code?.message} className="mb-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="인증코드 6자리 입력"
                  maxLength={6}
                  error={!!errors.code}
                  className="flex-1 min-w-0 tracking-widest"
                  {...register("code")}
                />
                <Button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isVerifying}
                  variant="primary"
                  width="sm"
                  className="whitespace-nowrap"
                >
                  확인
                </Button>
              </div>
            </FormField>
          )}

          <FormField label="비밀번호" error={errors.password?.message} className="mb-4">
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              error={!!errors.password}
              {...register("password")}
            />
          </FormField>

          <FormField label="비밀번호 확인" error={errors.passwordConfirm?.message} className="mb-8">
            <Input
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              error={!!errors.passwordConfirm}
              {...register("passwordConfirm")}
            />
          </FormField>

          <Button type="submit" disabled={isSubmitting || emailStep !== "verified"} variant="primary" width="full">
            가입하기
          </Button>
        </div>
      </form>

      <div className="flex items-center justify-center gap-2.5 mt-6 text-sm">
        <p className="text-gray-500">
          이미 계정이 있으신가요?
        </p>
        <Link href="/login" className="font-semibold text-blue-400 hover:underline">
          로그인
        </Link>
      </div>
    </div>
  );
}

