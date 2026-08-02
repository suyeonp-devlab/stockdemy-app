// 시장 지수 및 환율
export interface MarketIndex {
  marketCode: string;
  marketName: string;
  indexValue: number;
  changePercent: number;
}

// 업종별 등락 요약
export interface SectorSummary {
  sector: string;
  sectorNm: string;
  changePercent: number;
}
