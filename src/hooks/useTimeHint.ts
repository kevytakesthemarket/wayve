import { useEffect, useState } from 'react';

import { COPY } from '@/interview/copy';

const MINUTE = 60_000;

export function useTimeHint(startedAt: number | null): string {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, []);

  if (!startedAt) return COPY.timeEarly;
  const elapsed = now - startedAt;
  if (elapsed < 5 * MINUTE) return COPY.timeEarly;
  if (elapsed < 7 * MINUTE) return COPY.timeWindow;
  if (elapsed < 8 * MINUTE) return COPY.timeNearCap;
  return COPY.timeCap;
}
