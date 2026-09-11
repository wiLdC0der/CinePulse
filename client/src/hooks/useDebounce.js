import { useEffect, useState } from 'react';

// Delays updating the returned value until `value` has stopped
// changing for `delayMs`, so callers can debounce search input
// without an API request on every keystroke.
export function useDebounce(value, delayMs = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
