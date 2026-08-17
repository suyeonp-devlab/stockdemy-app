import { Code } from "@/shared/code/code.type";
import { FilterTabOption } from "@/shared/components/tab/FilterTabs";

/**
 * 공통코드 목록을 필터/탭 옵션 배열로 변환
 * @param codes 공통코드 목록
 * @example toFilterOptions([{ codeValue: "DOMESTIC", codeName: "국내", ... }]) → [{ label: "국내", value: "DOMESTIC", ... }]
 */
export const toFilterOptions = (codes: Code[]): FilterTabOption[] => {
  return codes.map((code) => ({ label: code.codeName, value: code.codeValue }));
};