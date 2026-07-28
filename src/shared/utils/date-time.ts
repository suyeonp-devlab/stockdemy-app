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

/**
 * 날짜를 원하는 포맷으로 변환
 * @param value 날짜 문자열 또는 Date
 * @param format 출력 포맷
 * @example formatDate("20250726", "yyyy.MM.dd") → "2025.07.26"
 * @example formatDate("20250726153045", "yyyy-MM-dd HH:mm") → "2025-07-26 15:30"
 */
export const formatDate = (
  value: string | Date | null | undefined,
  format = "yyyy-MM-dd",
): string => {

  if (!value) return "";

  const compact = value instanceof Date ? compactDate(value) : value.replace(/\D/g, "");

  const tokens: Record<string, string> = {
    yyyy: compact.slice(0, 4),
    MM: compact.slice(4, 6),
    dd: compact.slice(6, 8),
    HH: compact.slice(8, 10),
    mm: compact.slice(10, 12),
    ss: compact.slice(12, 14),
  };

  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (token) => tokens[token] ?? "");
};

/**
 * Date 객체를 구분자 없는 날짜 문자열로 변환
 * @param date 변환할 Date 객체
 * @example compactDate(new Date(2025, 6, 26, 15, 30, 45)) → "20250726153045"
 */
const compactDate = (date: Date): string => {

  return [
    date.getFullYear(),
    padStart(date.getMonth() + 1, 2, "0"),
    padStart(date.getDate(), 2, "0"),
    padStart(date.getHours(), 2, "0"),
    padStart(date.getMinutes(), 2, "0"),
    padStart(date.getSeconds(), 2, "0"),
  ].join("");
};

/**
 * 날짜와 시각을 Unix epoch seconds로 변환
 * @param date 날짜 문자열 (yyyy-MM-dd)
 * @param time 시각 문자열 (HH:mm)
 * @example toEpochSeconds("2025-07-26", "15:30") → 1753511400
 */
export const toEpochSeconds = (date: string, time: string): number => {

  const [hours, minutes] = time.split(":").map(Number);

  const datetime = new Date(date);
  datetime.setHours(hours, minutes, 0, 0);

  return Math.floor(datetime.getTime() / 1000);
};