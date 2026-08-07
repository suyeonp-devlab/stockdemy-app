import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 최소 실행 번들
  output: "standalone",
  // Next.js 프레임워크 사용여부 미노출
  poweredByHeader: false,
  // strictMode 사용여부
  reactStrictMode: true,
  // gzip 압축 적용여부
  compress: true,
  typescript: {
    // 타입에러 시 빌드 실패처리
    ignoreBuildErrors: false,
  },
  images: {
    // 외부 이미지 도메인 화이트리스트
    remotePatterns: [],
  },
};

export default nextConfig;