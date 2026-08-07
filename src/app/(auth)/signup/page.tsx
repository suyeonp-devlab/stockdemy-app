import type { Metadata } from "next";
import SignupForm from "@/features/auth/signup/SignupForm";

export const metadata: Metadata = { title: "회원가입" };

export default function SignupPage() {

  return (
    <div className="w-full max-w-sm md:max-w-4xl md:grid md:grid-cols-2 md:gap-16 md:items-center">
      {/* 데스크탑 왼쪽 영역 */}
      <div className="hidden md:block">
        <h1 className="text-5xl font-black text-gray-100 leading-tight mb-4">
          <span className="block opacity-0 animate-fadein" style={{ animationDelay: "0s" }}>
            지금 바로
          </span>
          <span className="block opacity-0 animate-fadein" style={{ animationDelay: "0.3s" }}>
            시작해보세요.
          </span>
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed opacity-0 animate-fadein" style={{ animationDelay: "0.8s" }}>
          AI가 뉴스를 분석하고<br />내 투자 판단을 복기해드려요.
        </p>
      </div>

      <SignupForm />
    </div>
  );
}
