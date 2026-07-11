"use client";

import { useState, useEffect, useRef } from "react";
import { formatSeconds } from "@/shared/utils/date-time";

interface CountdownTimerProps {
  seconds: number;        // 카운트다운 시간 (초)
  onExpire?: () => void;  // 시간 만료 시 콜백
}

export default function CountdownTimer({ seconds, onExpire }: CountdownTimerProps) {

  const [timeLeft, setTimeLeft] = useState(seconds);

  // 부모 리렌더 시 타이머 useEffect가 재실행되는 것을 방지
  const onExpireRef = useRef(onExpire);
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  useEffect(() => {
    if (timeLeft <= 0) return onExpireRef.current?.();
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const { m, s } = formatSeconds(timeLeft);

  return <span>{m}:{s}</span>;
}
