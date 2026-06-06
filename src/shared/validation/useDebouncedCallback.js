import { useCallback, useRef } from "react";

export const useDebouncedCallback = (callback, delayMs = 200) => {
  const timerRef = useRef(null);

  return useCallback(
    (...args) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delayMs);
    },
    [callback, delayMs],
  );
};
