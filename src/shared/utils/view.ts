import { CommonCode } from "@/shared/common-code/common-code.type";
import { FilterTabOption } from "@/shared/components/tab/FilterTabs";

/**
 * 공통코드 목록을 필터/탭 옵션 배열로 변환
 * @param codes 공통코드 목록
 * @example toFilterOptions([{ codeId: "DOMESTIC", codeNm: "국내", ... }]) → [{ label: "국내", value: "DOMESTIC", ... }]
 */
export const toFilterOptions = (codes: CommonCode[]): FilterTabOption[] => {
  return codes.map((code) => ({ label: code.codeNm, value: code.codeId }));
};