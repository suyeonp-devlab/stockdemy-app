/**
 * 로컬스토리지 값 조회
 * @param key 조회할 키
 * @example getLocalStorageItem("rememberedEmail") → ***@example.com
 */
export const getLocalStorageItem = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

/**
 * 로컬스토리지 값 저장
 * @param key 저장할 키
 * @param value 저장할 값
 * @example setLocalStorageItem("rememberedEmail", ***@example.com)
 */
export const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
};

/**
 * 로컬스토리지 값 삭제
 * @param key 삭제할 키
 * @example removeLocalStorageItem("rememberedEmail")
 */
export const removeLocalStorageItem = (key: string): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
};
