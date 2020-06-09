import { useState, useEffect } from "react";

// This is hardcoded because the key will go into the bundle anyway.
// To restrict usage, http referrers need to be whitelisted in the GCP Console.
export const GOOGLE_KEY = "AIzaSyDRvv4KrexparkBe668VRjlV3pQ7JOwQMA";

// Hook from https://usehooks.com/useDebounce/
export function useDebounce(value: any, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}
