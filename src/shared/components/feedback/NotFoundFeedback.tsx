import Link from "next/link";
import clsx from "clsx";

interface NotFoundProps {
  text?: string;
  href?: string;
  className?: string;
}

export default function NotFoundFeedback({
  text = "홈으로 이동",
  href = "/",
  className
}: NotFoundProps) {

  return (
    <div className={clsx("flex items-center justify-center px-6 py-10", className)}>
      <div className="text-center max-w-lg w-full">
        <div className="flex justify-center leading-none mb-6 select-none">
          <span className="text-[80px] md:text-[180px] font-black text-blue-400">4</span>
          <span className="text-[80px] md:text-[180px] font-black text-blue-400">0</span>
          <span className="text-[80px] md:text-[180px] font-black text-blue-400">4</span>
        </div>

        <h1 className="text-xl font-semibold text-gray-100 mb-3">
          페이지를 찾을 수 없습니다.
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          주소가 잘못되었거나 삭제된 페이지입니다.<br />입력하신 주소를 다시 확인해 주세요.
        </p>

        <Link href={href} className="inline-block px-8 py-3 min-w-42 md:min-w-56 bg-blue-500 text-white text-sm md:text-base font-semibold rounded-md hover:bg-blue-600 transition-colors">
          {text}
        </Link>
      </div>
    </div>
  );
}