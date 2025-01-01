"use client";
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, fallbackValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return fallbackValue;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallbackValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
