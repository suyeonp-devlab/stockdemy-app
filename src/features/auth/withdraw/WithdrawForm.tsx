"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/shared/components/button/Button";
import FormField from "@/shared/components/form/FormField";
import Input from "@/shared/components/form/Input";
import { useWithdrawMutation } from "@/features/auth/withdraw/withdraw.query";
import { WITHDRAW_SCHEMA, WITHDRAW_SCHEMA_TYPE } from "@/features/auth/withdraw/withdraw.schema";
import { useOverlay } from "@/system/overlay/useOverlay";

export default function WithdrawForm() {

  const router = useRouter();
  const { alert, confirm, closePopup } = useOverlay();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<WITHDRAW_SCHEMA_TYPE>({
    resolver: zodResolver(WITHDRAW_SCHEMA),
    mode: "onSubmit",
    defaultValues: { password: "" },
  });

  const { mutateAsync: withdraw } = useWithdrawMutation();

  // 회원 탈퇴
  const handleWithdraw = async (data: WITHDRAW_SCHEMA_TYPE) => {

    const confirmed = await confirm("회원 탈퇴를 진행하시겠습니까?\n탈퇴 후에는 정보를 복구할 수 없습니다.");
    if (!confirmed) return;

    await withdraw(data);
    closePopup();
    await alert("탈퇴가 완료되었습니다.\n그동안 이용해 주셔서 감사합니다.");
    router.replace("/login");
  };

  return (
    <form onSubmit={handleSubmit(handleWithdraw)} noValidate>
      <FormField label="비밀번호" error={errors.password?.message} className="mt-4 mb-6">
        <Input
          type="password"
          placeholder="비밀번호를 입력하세요"
          error={!!errors.password}
          {...register("password")}
        />
      </FormField>

      <div className="flex gap-1.5 mb-4">
        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-px md:mt-[3px]" />
        <p className="text-xs md:text-sm text-red-300 leading-relaxed">
          탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
        </p>
      </div>

      <Button
        type="submit" disabled={isSubmitting} variant="secondary" width="full"
        className="!bg-red-950 !text-red-300 !border-red-800 hover:!bg-red-900"
      >
        탈퇴하기
      </Button>
    </form>
  );
}
