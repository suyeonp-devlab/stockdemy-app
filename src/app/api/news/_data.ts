import { News, NewsDetail, NewsRelatedStock } from "@/features/news/news.type";

// 종목 풀 (종목 상세 mock에 존재하는 종목만 사용 → 종목 상세 이동 보장)
const STOCK_POOL = [
  { stockCode: "005930", stockName: "삼성전자", category: "DOMESTIC", categoryNm: "국내" },
  { stockCode: "000660", stockName: "SK하이닉스", category: "DOMESTIC", categoryNm: "국내" },
  { stockCode: "035420", stockName: "NAVER", category: "DOMESTIC", categoryNm: "국내" },
  { stockCode: "035720", stockName: "카카오", category: "DOMESTIC", categoryNm: "국내" },
  { stockCode: "373220", stockName: "LG에너지솔루션", category: "DOMESTIC", categoryNm: "국내" },
  { stockCode: "005380", stockName: "현대차", category: "DOMESTIC", categoryNm: "국내" },
  { stockCode: "068270", stockName: "셀트리온", category: "DOMESTIC", categoryNm: "국내" },
  { stockCode: "005490", stockName: "POSCO홀딩스", category: "DOMESTIC", categoryNm: "국내" },
  { stockCode: "NVDA", stockName: "NVIDIA", category: "OVERSEAS", categoryNm: "해외" },
  { stockCode: "AAPL", stockName: "Apple", category: "OVERSEAS", categoryNm: "해외" },
];

// 감성별 코드 및 뉴스 문구 템플릿
const SENTIMENTS = [
  {
    sentiment: "POSITIVE", sentimentNm: "긍정",
    title: (name: string) => `${name}, 실적 개선 기대감에 강세… 목표주가 상향`,
    summary: (name: string) => `${name}에 대한 시장의 기대감이 높아지고 있습니다. 주요 증권사들이 실적 전망을 상향 조정하며 투자심리가 개선되는 모습으로, 단기 모멘텀이 긍정적으로 평가됩니다. 주요 증권사들이 실적 전망을 상향 조정하며 투자심리가 개선되는 모습으로, 단기 모멘텀이 긍정적으로 평가됩니다. 주요 증권사들이 실적 전망을 상향 조정하며 투자심리가 개선되는 모습으로, 단기 모멘텀이 긍정적으로 평가됩니다. 주요 증권사들이 실적 전망을 상향 조정하며 투자심리가 개선되는 모습으로, 단기 모멘텀이 긍정적으로 평가됩니다.`,
    reasoning: "복수 증권사의 동시 목표주가 상향과 구체적인 실적 개선 근거가 제시된 점이 긍정 판단의 핵심 근거입니다. 다만 업황 변동성은 유의할 필요가 있습니다.",
    impact: "BENEFIT",
  },
  {
    sentiment: "NEUTRAL", sentimentNm: "중립",
    title: (name: string) => `${name}, 관망세 속 보합권 등락… 방향성 탐색`,
    summary: (name: string) => `${name}이(가) 뚜렷한 방향성 없이 보합권에서 등락을 거듭하고 있습니다. 투자자들이 추가 재료를 기다리며 관망하는 분위기로, 당분간 변동성은 제한적일 것으로 보입니다.`,
    reasoning: "긍정·부정 재료가 혼재되어 있고 명확한 방향성을 제시하는 근거가 부족해 중립으로 판단했습니다.",
    impact: "LIMITED",
  },
  {
    sentiment: "NEGATIVE", sentimentNm: "부정",
    title: (name: string) => `${name}, 불확실성 확대에 약세… 투자심리 위축`,
    summary: (name: string) => `${name}을(를) 둘러싼 불확실성이 커지면서 약세 흐름이 이어지고 있습니다. 단기적으로 투자심리가 위축된 모습이며, 관련 리스크 요인에 대한 모니터링이 필요한 상황입니다.`,
    reasoning: "불확실성 확대와 투자심리 위축이 동시에 나타나고 있어 부정으로 판단했습니다. 리스크 해소 여부를 지켜볼 필요가 있습니다.",
    impact: "ADVERSE",
  },
];

// 관련 종목 영향 코드 (감성 코드와 별도 체계)
const IMPACTS: Record<string, { impact: string; impactNm: string }> = {
  BENEFIT: { impact: "BENEFIT", impactNm: "동반 수혜" },
  LIMITED: { impact: "LIMITED", impactNm: "제한적 영향" },
  ADVERSE: { impact: "ADVERSE", impactNm: "동반 약세" },
};

// 뉴스 출처
const SOURCES = ["한국경제", "매일경제", "연합뉴스", "서울경제"];

// 발행 시점 라벨 (index 기준 상대 시간)
const toPublishedAt = (index: number) => {
  const hours = index + 1;
  return hours < 24 ? `${hours}시간 전` : `${Math.floor(hours / 24)}일 전`;
};

// 전체 뉴스 mock (결정적 생성)
const TOTAL_COUNT = 51;
export const ALL_NEWS: News[] = Array.from({ length: TOTAL_COUNT }, (_, i) => {
  const stock = STOCK_POOL[i % STOCK_POOL.length];
  const tone = SENTIMENTS[i % SENTIMENTS.length];
  return {
    id: i + 1,
    stockCode: stock.stockCode,
    stockName: stock.stockName,
    title: tone.title(stock.stockName),
    summary: tone.summary(stock.stockName),
    publishedAt: toPublishedAt(i),
    category: stock.category,
    categoryNm: stock.categoryNm,
    sentiment: tone.sentiment,
    sentimentNm: tone.sentimentNm,
    sourceUrl: `https://example.com/news/${i + 1}`,
    sourceName: SOURCES[i % SOURCES.length],
  };
});

// 뉴스 상세 mock 생성 (목록과 동일한 시드로 결정적 생성)
export const buildNewsDetail = (id: string): NewsDetail | null => {

  const index = Number(id) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= TOTAL_COUNT) return null;

  const news = ALL_NEWS[index];
  const stock = STOCK_POOL[index % STOCK_POOL.length];
  const tone = SENTIMENTS[index % SENTIMENTS.length];
  const impact = IMPACTS[tone.impact];

  // 관련 종목: 같은 카테고리에서 주체 종목 제외 최대 2개 선택
  const candidates = STOCK_POOL.filter(
    (item) => item.category === stock.category && item.stockCode !== stock.stockCode,
  );
  const relatedStocks: NewsRelatedStock[] = Array.from(
    { length: Math.min(2, candidates.length) },
    (_, i) => {
      const related = candidates[(index + i) % candidates.length];
      return {
        stockCode: related.stockCode,
        stockName: related.stockName,
        impact: impact.impact,
        impactNm: impact.impactNm,
      };
    },
  );

  return {
    ...news,
    confidence: 70 + ((index * 7) % 26),
    reasoning: tone.reasoning,
    relatedStocks,
  };
};
