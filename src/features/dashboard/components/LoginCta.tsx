import Link from "next/link";

export default function LoginCta() {

  return (
    <section className="bg-gray-900 mt-6 mb-12">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-12 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">내 투자 판단을 AI로 복기해보세요.</h3>
        <p className="text-sm text-gray-400 mb-8">매수/매도 기록을 남기면 AI가 당시 시장 흐름을 분석해드려요.</p>
        <Link
          href="/login"
          className="inline-block px-8 py-3 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-colors"
        >
          로그인 후 시작하기
        </Link>
      </div>
    </section>
  );
}
