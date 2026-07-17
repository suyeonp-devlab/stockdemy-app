/**
 * 숫자 천 단위 콤마 포맷
 * @param value 변환할 숫자 또는 문자열
 * @example formatNumber(-1234567.89) → "-1,234,567.89"
 * @example formatNumber("1234567.89") → "1,234,567.89"
 * @example formatNumber(null) → ""
 */
export const formatNumber = (
  value: number | string | null | undefined
): string => {

  if (value === null || value === undefined) return "";

  const valueStr = String(value).trim();
  if (valueStr === "" || Number.isNaN(Number(valueStr))) return "";

  const sign = valueStr.startsWith("-") ? "-" : "";
  const unsigned = sign ? valueStr.slice(1) : valueStr;

  const [integer = "", decimal] = unsigned.split(".");

  const formattedInteger = (integer || "0").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}${formattedInteger}${decimal !== undefined ? `.${decimal}` : ""}`;
};