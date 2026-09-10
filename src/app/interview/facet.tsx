import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { Card } from '@/components/Card';
import { ExpandingText } from '@/components/ExpandingText';
import { Heading } from '@/components/Heading';
import { InterviewChrome } from '@/components/InterviewChrome';
import { Notice } from '@/components/Notice';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useAnswerGate } from '@/hooks/useAnswerGate';
import { COPY } from '@/interview/copy';
import { useInterview } from '@/interview/context';
import { PROBE_FACET } from '@/scoring/cliches';

export default function FacetScreen() {
  const router = useRouter();
  const { state, setFacet } = useInterview();
  const [text, setText] = useState(state.facet.text);
  const { notice, submit } = useAnswerGate(PROBE_FACET);
  const question = state.facetQuestion;

  useEffect(() => {
    if (!question) {
      router.replace('/interview/member-check');
    }
  }, [question, router]);

  if (!question) return null;

  const prompt = question === 'club-fit' ? COPY.clubFitQ : COPY.friendshipQ;

  return (
    <Screen
      footer={
        <PrimaryButton
          label={COPY.continue}
          disabled={!text.trim()}
          onPress={() => {
            const answer = submit(text);
            if (!answer) return;
            setFacet(answer);
            router.push('/interview/member-check');
          }}
        />
      }
    >
      <InterviewChrome step={5} total={6} startedAt={state.startedAt} onBack={() => router.back()} />
      <Card>
        <Heading size="md">{prompt}</Heading>
        <ExpandingText
          value={text}
          onChangeText={setText}
          placeholder={
            question === 'club-fit'
              ? 'Stay past 15 minutes if… Leave if…'
              : 'Weekly, from class, or once a month — and the last time it actually fit.'
          }
        />
        {notice ? <Notice text={notice} /> : null}
      </Card>
    </Screen>
  );
}
