"use client";
import { useEffect, useRef, useState } from "react";

/**
 * useState that persists to localStorage — the app's client-side "memory".
 *
 * SSR/hydration-safe: renders `initial` on the server and on the first client
 * paint (so markup matches), then rehydrates from localStorage on mount and
 * writes back on every change. The `ready` + `hydratedKeyRef` guards prevent
 * writing stale values into a new key when the key changes (e.g. profile switch).
 */
export function usePersistentState<T>(
  key: string,
  initial: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const hydratedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    setReady(false);
    let next: T = initial;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) next = JSON.parse(raw) as T;
    } catch {
      next = initial;
    }
    setValue(next);
    hydratedKeyRef.current = key;
    setReady(true);

    const handleCustomStorage = (e: Event) => {
      const detail = (e as CustomEvent<{ key: string; newValue: T }>).detail;
      if (detail?.key === key) setValue(detail.newValue);
    };

    window.addEventListener("ligo:storage", handleCustomStorage);
    return () => {
      window.removeEventListener("ligo:storage", handleCustomStorage);
      if (hydratedKeyRef.current === key) hydratedKeyRef.current = null;
    };
  }, [key, initial]);

  useEffect(() => {
    if (!ready || hydratedKeyRef.current !== key) return;
    try {
      const stringified = JSON.stringify(value);
      const raw = window.localStorage.getItem(key);
      if (raw !== stringified) {
        window.localStorage.setItem(key, stringified);
        window.dispatchEvent(
          new CustomEvent("ligo:storage", { detail: { key, newValue: value } })
        );
      }
    } catch {
      /* ignore */
    }
  }, [key, value, ready]);

  return [value, setValue];
}
