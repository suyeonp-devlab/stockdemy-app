import { requestRequired } from "@/shared/lib/axios";
import { CommonCode, CommonCodeRequest, CommonCodeResponse } from "@/shared/common-code/common-code.type";

const ALL_OPTION: CommonCode = { codeId: "", codeNm: "전체", sortNo: 0, useYn: "Y" };

// 공통코드 조회
export const getCommonCodes = async (params: CommonCodeRequest) => {
  const response = await requestRequired<CommonCodeResponse>({ method: "GET", url: `/api/common-codes/${params.groupId}`, params });
  if (!params.exceptAllOption) response.items.unshift({ ...ALL_OPTION });
  return response;
}