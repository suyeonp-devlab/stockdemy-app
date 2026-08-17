// 공통코드 request
export interface CodeRequest {
  groupId: string;
  codeValue?: string | null;
  exceptAllOption?: boolean;
}

// 공통코드 response
export interface CodeResponse {
  groupId: string;
  groupName: string;
  codes: Code[];
}

// 공통코드 항목
export interface Code {
  codeId: number;
  codeValue: string;
  codeName: string;
  param1?: string | null;
  param2?: string | null;
  param3?: string | null;
}
