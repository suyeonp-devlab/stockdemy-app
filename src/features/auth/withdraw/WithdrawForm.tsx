"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import Button from "@/shared/components/button/Button";
import FormField from "@/shared/components/form/FormField";
import Input from "@/shared/components/form/Input";
import { useGoogleWithdrawMutation, useWithdrawMutation } from "@/features/auth/withdraw/withdraw.query";
import { useOverlay } from "@/system/overlay/useOverlay";
import { WithdrawRequest } from "@/features/auth/auth.type";
import React, { useState } from "react";

interface WithdrawFormProps {
  isGoogleUser: boolean;
}

export default function WithdrawForm({ isGoogleUser }: WithdrawFormProps) {

  const router = useRouter();
  const { alert, confirm, closePopup } = useOverlay();

  const [request, setRequest] = useState<WithdrawRequest>({ password: "" });
  const [errorKey, setErrorKey] = useState<string[]>([]);

  const isPasswordError = errorKey.includes("password") && request.password.trim().length === 0;

  const { mutateAsync: withdraw, isPending } = useWithdrawMutation();
  const { mutateAsync: googleWithdraw, isPending: isGooglePending } = useGoogleWithdrawMutation();

  const isWithdrawPending = isPending || isGooglePending;

  // 회원 탈퇴
  const handleWithdraw = async (e: React.SubmitEvent<HTMLFormElement>) => {

    e.preventDefault();

    // validation
    const nextErrorKey: string[] = [];

    if (!isGoogleUser && request.password.trim().length === 0) {
      nextErrorKey.push("password");
    }

    setErrorKey(nextErrorKey);
    if (nextErrorKey.length > 0) return;

    // 탈퇴
    const confirmed = await confirm("회원 탈퇴를 진행하시겠습니까?\n탈퇴 후에는 정보를 복구할 수 없습니다.");
    if (!confirmed) return;

    if (isGoogleUser) await googleWithdraw();
    else await withdraw(request);

    closePopup();
    await alert("탈퇴가 완료되었습니다.\n그동안 이용해 주셔서 감사합니다.");
    router.replace("/login");
  };

  return (
    <form onSubmit={handleWithdraw} noValidate>
      {!isGoogleUser && (
        <FormField
          label="비밀번호"
          error={isPasswordError ? "비밀번호를 입력해주세요." : undefined}
          className="mt-4 mb-6"
        >
          <Input
            type="password"
            placeholder="비밀번호를 입력하세요"
            error={isPasswordError}
            onChange={(e) => setRequest(prev => ({ ...prev, password: e.target.value }))}
          />
        </FormField>
      )}

      <div className="flex gap-1.5 mb-4">
        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-px md:mt-[3px]" />
        <p className="text-xs md:text-sm text-red-300 leading-relaxed">
          탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
        </p>
      </div>

      <Button
        type="submit" disabled={isWithdrawPending} variant="secondary" width="full"
        className="!bg-red-950 !text-red-300 !border-red-800 hover:!bg-red-900"
      >
        탈퇴하기
      </Button>
    </form>
  );
}
