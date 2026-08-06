// 관심종목 mock 저장소 (서버 프로세스가 살아있는 동안 유지되는 in-memory store)
export const favoriteStockCodes = new Set<string>(["035420", "005380"]);

export const setFavoriteStock = (code: string, favorite: boolean) => {
  if (favorite) favoriteStockCodes.add(code);
  else favoriteStockCodes.delete(code);
};
