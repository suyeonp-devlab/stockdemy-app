import { useEffect } from "react";

/**
 * body 스크롤 고정 hook
 * active가 true일 때 body를 fixed 처리해 스크롤을 막는다.
 */
export function useBodyScrollLock(active: boolean) {

  useEffect(() => {

    if (!active) return;

    // 현재 스크롤 위치
    const scrollY = window.scrollY;

    const originalStyle = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalStyle.overflow;
      document.body.style.position = originalStyle.position;
      document.body.style.top = originalStyle.top;
      document.body.style.width = originalStyle.width;

      // 이전 스크롤 위치로 복원
      window.scrollTo(0, scrollY);
    };
  }, [active]);
}
