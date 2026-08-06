import { NextResponse } from "next/server";
import { isMarketOpen, round2, seedOf, seededRandom } from "@/app/api/stocks/_mock";

interface SectorBase {
  sector: string;
  sectorNm: string;
  baseChangePercent: number;
}

// 서버에서 14개 잘라서 내려줘야함
const SECTOR_BASE: SectorBase[] = [
  { sector: "ELECTRONICS", sectorNm: "전기전자", baseChangePercent: 2.81 },
  { sector: "CHEMICAL", sectorNm: "화학", baseChangePercent: -0.42 },
  { sector: "TRANSPORT_EQUIPMENT", sectorNm: "운수장비", baseChangePercent: 1.13 },
  { sector: "PHARMACEUTICAL", sectorNm: "의약품", baseChangePercent: -1.24 },
  { sector: "FINANCIAL", sectorNm: "금융업", baseChangePercent: 0.35 },
  { sector: "STEEL_METAL", sectorNm: "철강금속", baseChangePercent: 3.26 },
  { sector: "CONSTRUCTION", sectorNm: "건설업", baseChangePercent: -0.67 },
  { sector: "RETAIL", sectorNm: "유통업", baseChangePercent: 0.88 },
  { sector: "FOOD_BEVERAGE", sectorNm: "음식료품", baseChangePercent: 0.59 },
  { sector: "TEXTILE_APPAREL", sectorNm: "섬유의복", baseChangePercent: -0.91 },
  { sector: "PAPER_WOOD", sectorNm: "종이목재", baseChangePercent: -0.32 },
  { sector: "NON_METALLIC_MINERAL", sectorNm: "비금속광물", baseChangePercent: 1.63 },
  { sector: "MACHINERY", sectorNm: "기계", baseChangePercent: 0.74 },
  { sector: "MEDICAL_PRECISION", sectorNm: "의료정밀", baseChangePercent: 2.15 },
];

// 실시간 업종 등락률 계산 (장중이면 3초 단위로 변하는 결정적 난수, 장마감이면 고정)
function computeLiveChangePercent(base: SectorBase): number {

  const seed = seedOf(base.sector);

  if (!isMarketOpen("KOSPI")) {
    // 장마감 → 개장 이후 흐름을 반영한 값으로 고정 (요청마다 동일)
    const closeRandom = seededRandom(seed + 1);
    const drift = (closeRandom() - 0.5) * 0.3;
    return round2(base.baseChangePercent + drift);
  }

  // 장중 → 3초 단위로 값이 바뀌는 결정적 난수 (폴링 시 실제로 변하는 것처럼 보이게)
  const bucket = Math.floor(Date.now() / 3000);
  const tickRandom = seededRandom(seed + bucket);
  const drift = (tickRandom() - 0.5) * 0.15;
  return round2(base.baseChangePercent + drift);
}

// 업종별 등락 mock (폴링 전용)
export async function GET() {

  const data = SECTOR_BASE.map((base) => ({
    sector: base.sector,
    sectorNm: base.sectorNm,
    changePercent: computeLiveChangePercent(base),
  }));

  return NextResponse.json({ success: true, code: "OK", message: "조회 성공", data });
}
