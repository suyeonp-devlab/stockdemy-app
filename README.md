# Stockdemy

AI 기반 주식 일지 & 뉴스 분석 서비스.
- 관심 종목 시세 확인
- 뉴스의 시장 감성 분석
- AI를 통해 주식 매매기록 복기


### 주요 기능

- **홈 대시보드** — 코스피/코스닥 지수 티커, 실시간 이슈 업종 순위, 거래량 상위 종목, 주목할만한 뉴스
- **종목 검색** — 시장별(코스피/코스닥/미국) · 업종별 탭 전환, 관심 종목 등록, AI 평가 배지, 오늘의 공시
- **종목 상세** — OHLC 캔들 차트(이동평균선·거래량 포함), 시세/밸류에이션 지표, AI 코멘트, 관련 뉴스·공시
- **뉴스 & AI 분석** — 카테고리 필터, 오늘의 시장 감성 요약, 많이 언급된 종목
- **주식 일지** — 매수/매도 기록 작성, AI 복기 분석 요청

### 기술 스택

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + TypeScript
- Tailwind CSS v4
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs) — 클라이언트 상태 관리
- [lightweight-charts](https://github.com/tradingview/lightweight-charts)
- react-hook-form + zod
- axios
- @react-oauth/google — 구글 소셜 로그인
- lucide-react, react-icons — 아이콘

### 폴더 구조

기능 단위(feature) 구성

```
src/
├── app/                     # 라우트 (App Router)
│   ├── (auth)/              # 로그인 / 회원가입 / 비밀번호 재설정
│   ├── (main)/              # 대시보드 / 종목 / 뉴스 / 일지 / 마이페이지
├── features/                # 도메인별 기능
│   └── {feature}/           # 도메인
│       ├── components/      # 컴포넌트
│       ├── skeleton/        # 스켈레톤 
│       ├── hooks/           # 훅
│       ├── *.type.ts        # 타입 정의
│       ├── *.api.ts         # axios 요청 함수
│       ├── *.query.ts       # React Query 훅
│       ├── *.schema.ts      # zod 검증 스키마 (일부 도메인)
│       └── *Page.tsx        # 페이지 컴포넌트
├── shared/                  # 공용 컴포넌트, 훅, 유틸, 상태
├── styles/                  # 전역 스타일 (css)
└── system/                  # 전역 시스템
    ├── auth/                # 클라이언트 인증 가드
    └── overlay/             # 전역 오버레이
```