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

/**
 * 가격 포맷
 * @param value 변환할 숫자 또는 문자열
 * @param market 주식 시장
 * @example formatPrice(1234567.89) → "$1,234,567.89"
 * @example formatPrice(1234567.89, "KOSPI") → "1,234,567.89원"
 * @example formatPrice(null) → ""
 */
export const formatPrice = (
  value: number | string | null | undefined, market: string = "NASDAQ"
): string => {

  const valueStr = formatNumber(value);
  if (valueStr === "") return "";

  return market === "NASDAQ" ? `$${valueStr}` : `${valueStr}원`;
};

/**
 * 가격 큰 단위 포맷
 * @param value 변환할 숫자 또는 문자열
 * @param market 주식 시장
 * @example formatLargeCurrency(1_250_000_000_000) → "$1.3T"
 * @example formatLargeCurrency(1_250_000_000_000, "KOSPI") → "1.3조원"
 * @example formatLargeCurrency(null) → ""
 */
export const formatLargeCurrency = (
  value: number | string | null | undefined,
  market = "NASDAQ",
) => {

  const valueNum = Number(value);
  if (Number.isNaN(valueNum)) return "";

  if (market === "NASDAQ") {
    if (valueNum >= 1e12) return `$${(valueNum / 1e12).toFixed(1)}T`;
    if (valueNum >= 1e9) return `$${(valueNum / 1e9).toFixed(1)}B`;
    if (valueNum >= 1e6) return `$${(valueNum / 1e6).toFixed(1)}M`;
    return `$${formatNumber(valueNum)}`;
  }

  if (valueNum >= 1e12) return `${(valueNum / 1e12).toFixed(1)}조원`;
  if (valueNum >= 1e8) return `${(valueNum / 1e8).toFixed(1)}억원`;
  return `${formatNumber(valueNum)}원`;
};

