// 공통코드 request
export interface CommonCodeRequest {
  groupId: string;
  codeId?: string | null;
  exceptAllOption?: boolean;
}

// 공통코드 response
export interface CommonCodeResponse {
  groupId: string;
  groupNm: string;
  items: CommonCode[];
}

// 공통코드 항목
export interface CommonCode {
  codeId: string;
  codeNm: string;
  sortNo: number;
  useYn: string;
  param1?: string | null;
  param2?: string | null;
  param3?: string | null;
}
