import { useState } from 'react';

import type { WrittenAnswer } from '@/interview/types';
import { CLICHE_BOUNCE_COPY } from '@/scoring/cliches';
import { scorer } from '@/scoring';

export function useAnswerGate(probeCopy: string) {
  const [notice, setNotice] = useState<string | null>(null);
  const [clicheBounced, setClicheBounced] = useState(false);
  const [probed, setProbed] = useState(false);

  function resetGate() {
    setNotice(null);
    setClicheBounced(false);
    setProbed(false);
  }

  function submit(text: string, photoUri?: string | null): WrittenAnswer | null {
    const trimmed = text.trim();
    if (!trimmed) return null;
    const analysis = scorer.analyzeAnswer(trimmed);

    if (analysis.isClicheOnly && !clicheBounced) {
      setClicheBounced(true);
      setNotice(CLICHE_BOUNCE_COPY);
      return null;
    }

    if (!analysis.hasScene && !analysis.isClicheOnly && !probed) {
      setProbed(true);
      setNotice(probeCopy);
      return null;
    }

    return {
      text: trimmed,
      photoUri: photoUri ?? null,
      probed,
      clicheBounced,
      acceptedCliche: analysis.isClicheOnly,
    };
  }

  return { notice, submit, resetGate, clicheBounced, probed };
}
