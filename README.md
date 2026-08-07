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
- **주식 일지** — 매수/매도 기록 작성, AI 복기 분석 요청, 유형/종목/기간별 필터

### 기술 스택

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + TypeScript
- Tailwind CSS v4
- [TanStack Query](https://tanstack.com/query)
- [lightweight-charts](https://github.com/tradingview/lightweight-charts)
- react-hook-form + zod

### 폴더 구조

기능 단위(feature) 구성

```
src/
├── app/                 # 라우트 (App Router)
├── features/            # 도메인별 기능 (auth, dashboard, stocks, news, journals)
│   └── {feature}/
│       ├── components/  # 해당 도메인 전용 컴포넌트
│       ├── lib/         # 해당 도메인 전용 유틸/로직
│       ├── *.type.ts    # 타입 정의
│       ├── *.api.ts     # axios 요청 함수
│       ├── *.query.ts   # React Query 훅
│       └── *Page.tsx    # 페이지 컴포넌트
├── shared/              # 공용 컴포넌트, 훅, 유틸
└── system/              # 전역 시스템
```