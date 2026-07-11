import { padStart } from "@/shared/utils/string";

/**
 * 초를 시/분/초로 포맷
 * @param seconds 변환할 초
 * @param options 반환할 단위 (기본값: 분, 초만 반환)
 * @example formatSeconds(150) → { m: "02", s: "30" }
 * @example formatSeconds(3661, { h: true, m: true, s: true }) → { h: "01", m: "01", s: "01" }
 */
export const formatSeconds = (
  seconds: number,
  options: { h?: boolean; m?: boolean; s?: boolean } = { m: true, s: true }
) => {

  const result: { h?: string; m?: string; s?: string } = {};

  if (options.h) {
    result.h = padStart(Math.floor(seconds / 3600), 2, "0");
    if (options.m) result.m = padStart(Math.floor((seconds % 3600) / 60), 2, "0");
  } else if (options.m) {
    result.m = padStart(Math.floor(seconds / 60), 2, "0");
  }

  if (options.s) result.s = padStart(seconds % 60, 2, "0");

  return result;
};