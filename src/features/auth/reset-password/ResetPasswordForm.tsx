"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import Button from "@/shared/components/button/Button";
import FormField from "@/shared/components/form/FormField";
import Input from "@/shared/components/form/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useSendPasswordResetCodeMutation,
  useVerifyPasswordResetCodeMutation,
  useResetPasswordMutation,
} from "@/features/auth/reset-password/reset-password.query";
import { RESET_PASSWORD_SCHEMA, RESET_PASSWORD_SCHEMA_TYPE } from "@/features/auth/reset-password/reset-password.schema";
import { useOverlay } from "@/system/overlay/useOverlay";

type EmailStep = "input" | "sent" | "verified";

export default function ResetPasswordForm() {

  const router = useRouter();
  const { alert } = useOverlay();

  const { register, handleSubmit, getValues, trigger, formState: { errors, isSubmitting } } = useForm<RESET_PASSWORD_SCHEMA_TYPE>({
    resolver: zodResolver(RESET_PASSWORD_SCHEMA),
    mode: "onSubmit",
    defaultValues: { email: "", password: "", passwordConfirm: "", code: "" },
  });

  // 이메일 인증 단계
  const [emailStep, setEmailStep] = useState<EmailStep>("input");

  const { mutateAsync: sendCode, isPending: isSending } = useSendPasswordResetCodeMutation();
  const { mutateAsync: verifyCode, isPending: isVerifying } = useVerifyPasswordResetCodeMutation();
  const { mutateAsync: resetPassword } = useResetPasswordMutation();

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
    setEmailStep("verified");
  };

  // 비밀번호 재설정
  const handleResetPassword = async (data: RESET_PASSWORD_SCHEMA_TYPE) => {
    await resetPassword(data);
    await alert("비밀번호가 변경되었습니다.\n변경된 비밀번호로 로그인 후 이용바랍니다.");
    router.replace("/login");
  };

  return (
    <div className="w-full">
      <div className="text-center md:text-left mb-4">
        <h2 className="text-2xl font-bold text-gray-100">비밀번호 재설정</h2>
      </div>

      <form onSubmit={handleSubmit(handleResetPassword)} noValidate>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
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

          {/* 인증 완료 후 비밀번호 변경 */}
          {emailStep === "verified" && (
            <>
              <FormField label="새 비밀번호" error={errors.password?.message} className="mb-4">
                <Input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  error={!!errors.password}
                  {...register("password")}
                />
              </FormField>

              <FormField label="새 비밀번호 확인" error={errors.passwordConfirm?.message} className="mb-8">
                <Input
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  error={!!errors.passwordConfirm}
                  {...register("passwordConfirm")}
                />
              </FormField>

              <Button type="submit" disabled={isSubmitting} variant="primary" width="full">
                비밀번호 변경하기
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
