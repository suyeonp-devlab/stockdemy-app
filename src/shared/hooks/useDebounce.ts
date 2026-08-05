"use client";

import { useEffect, useState } from "react";

/** 디바운스 (연속된 이벤트를 하나로 묶어 마지막만 실행) hook */
export function useDebounce<T>(value: T, delay = 300): T {

  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
