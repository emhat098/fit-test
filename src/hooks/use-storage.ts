"use client";

import { useCallback, useEffect, useState } from "react";

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function useStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const storage = getStorage();
    if (!storage) return initialValue;
    try {
      const item = storage.getItem(key);
      return item != null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next =
          typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
        const storage = getStorage();
        if (storage) {
          try {
            storage.setItem(key, JSON.stringify(next));
          } catch {
            // quota exceeded or disabled
          }
        }
        return next;
      });
    },
    [key],
  );

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue != null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch {
          // ignore invalid JSON
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key]);

  return [storedValue, setValue];
}
