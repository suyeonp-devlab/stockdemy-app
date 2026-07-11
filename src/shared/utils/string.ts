/**
 * 숫자 또는 문자열을 지정한 길이로 앞을 채워 문자열로 반환
 * @param value 변환할 숫자 또는 문자열
 * @param length 채울 길이
 * @param fill 채울 문자
 * @example padStart(2, 2, "0") → "02"
 */
export const padStart = (
  value: number | string,
  length: number,
  fill: string
): string => {
  return value.toString().padStart(length, fill);
};