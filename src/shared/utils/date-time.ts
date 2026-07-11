import { padStart } from "@/shared/utils/string";

/**
 * 초를 분/초로 포맷
 * @param seconds 변환할 초
 * @param options 반환할 단위
 * @example formatSeconds(150) → { m: "02", s: "30" }
 */
export const formatSeconds = (
  seconds: number,
  options: { m?: boolean; s?: boolean } = { m: true, s: true }
) => {

  const result: { h?: string; m?: string; s?: string } = {};

  if (options.m) result.m = padStart(Math.floor(seconds / 60), 2, "0");
  if (options.s) result.s = padStart(seconds % 60, 2, "0");

  return result;
};