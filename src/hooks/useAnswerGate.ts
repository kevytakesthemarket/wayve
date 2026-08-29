import { useRef, useState } from 'react';

import type { WrittenAnswer } from '@/interview/types';
import { CLICHE_BOUNCE_COPY } from '@/scoring/cliches';
import { nextAnswerAction } from '@/scoring/heuristic';
import { scorer } from '@/scoring';

export function useAnswerGate(probeCopy: string) {
  const [notice, setNotice] = useState<string | null>(null);
  const flags = useRef({ clicheBounced: false, probed: false });

  function resetGate() {
    flags.current = { clicheBounced: false, probed: false };
    setNotice(null);
  }

  function submit(text: string, photoUri?: string | null): WrittenAnswer | null {
    const trimmed = text.trim();
    if (!trimmed) return null;
    const action = nextAnswerAction(trimmed, flags.current);

    if (action === 'bounce') {
      flags.current.clicheBounced = true;
      setNotice(CLICHE_BOUNCE_COPY);
      return null;
    }

    if (action === 'probe') {
      flags.current.probed = true;
      setNotice(probeCopy);
      return null;
    }

    const analysis = scorer.analyzeAnswer(trimmed);
    return {
      text: trimmed,
      photoUri: photoUri ?? null,
      probed: flags.current.probed,
      clicheBounced: flags.current.clicheBounced,
      acceptedCliche: analysis.isClicheOnly,
    };
  }

  return {
    notice,
    submit,
    resetGate,
    clicheBounced: flags.current.clicheBounced,
    probed: flags.current.probed,
  };
}
