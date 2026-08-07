"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/shared/components/button/Button";
import FormField from "@/shared/components/form/FormField";
import Input from "@/shared/components/form/Input";
import { useChangePasswordMutation } from "@/features/auth/change-password/change-password.query";
import { useOverlay } from "@/system/overlay/useOverlay";
import { CHANGE_PASSWORD_SCHEMA, CHANGE_PASSWORD_SCHEMA_TYPE } from "@/features/auth/change-password/change-password.schema";
import { useAuthStore } from "@/shared/store/auth.store";
import { Info } from "lucide-react";

export default function ChangePasswordForm() {

  const { alert, closePopup } = useOverlay();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CHANGE_PASSWORD_SCHEMA_TYPE>({
    resolver: zodResolver(CHANGE_PASSWORD_SCHEMA),
    mode: "onSubmit",
    defaultValues: { currentPassword: "", newPassword: "", newPasswordConfirm: "" },
  });

  const { mutateAsync: changePassword } = useChangePasswordMutation();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  // 비밀번호 변경
  const handleChangePassword = async (data: CHANGE_PASSWORD_SCHEMA_TYPE) => {
    const result = await changePassword(data);
    setAccessToken(result.accessToken);
    closePopup();
    await alert("비밀번호가 변경되었습니다.");
  };

  return (
    <form onSubmit={handleSubmit(handleChangePassword)} noValidate>
      <FormField label="현재 비밀번호" error={errors.currentPassword?.message} className="mt-4 mb-4">
        <Input
          type="password"
          placeholder="현재 비밀번호를 입력하세요"
          error={!!errors.currentPassword}
          {...register("currentPassword")}
        />
      </FormField>

      <FormField label="새 비밀번호" error={errors.newPassword?.message} className="mb-4">
        <Input
          type="password"
          placeholder="새 비밀번호를 입력하세요"
          error={!!errors.newPassword}
          {...register("newPassword")}
        />
      </FormField>

      <FormField label="새 비밀번호 확인" error={errors.newPasswordConfirm?.message} className="mb-6">
        <Input
          type="password"
          placeholder="새 비밀번호를 다시 입력하세요"
          error={!!errors.newPasswordConfirm}
          {...register("newPasswordConfirm")}
        />
      </FormField>

      <div className="flex gap-1.5 mb-4">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-px md:mt-[3px]" />
        <p className="text-xs md:text-sm text-blue-300 leading-relaxed">
          현재 기기를 제외한 모든 기기에서 자동으로 로그아웃됩니다.
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting} variant="primary" width="full">
        변경하기
      </Button>
    </form>
  );
}
