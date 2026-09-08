"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Demo delay khi click dòng → panel chi tiết. */
export const DETAIL_REVEAL_MS = 1500;
export const DETAIL_REVEAL_MS_REDUCED = 280;

export function shouldRevealDetail(id: string, current: string | null, dismissed = false): boolean {
  return !(id === current && !dismissed);
}

export function useDetailReveal() {
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (timer.current != null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => () => clear(), [clear]);

  const start = useCallback(() => {
    clear();
    setBusy(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = window.setTimeout(() => {
      setBusy(false);
      timer.current = null;
    }, reduced ? DETAIL_REVEAL_MS_REDUCED : DETAIL_REVEAL_MS);
  }, [clear]);

  return { busy, start };
}
