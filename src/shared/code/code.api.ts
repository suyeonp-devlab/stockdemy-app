import { requestRequired } from "@/shared/lib/axios";
import { Code, CodeRequest, CodeResponse } from "@/shared/code/code.type";

const ALL_OPTION: Code = { codeId: 0, codeValue: "", codeName: "전체" };

// 공통코드 조회
export const getCommonCodes = async (params: CodeRequest) => {
  const response = await requestRequired<CodeResponse>({ method: "GET", url: `/api/codes/${params.groupId}`, params, meta: { skipErrorAlert: true } });
  if (!params.exceptAllOption) response.codes.unshift({ ...ALL_OPTION });
  return response;
}