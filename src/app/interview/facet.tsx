import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { ExpandingText } from '@/components/ExpandingText';
import { InterviewChrome } from '@/components/InterviewChrome';
import { Notice } from '@/components/Notice';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Title } from '@/components/Title';
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
    if (!question) router.replace('/interview/member-check');
  }, [question, router]);

  if (!question) return null;

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
      <Title>{question === 'club-fit' ? 'Club-fit' : 'Friendship'}</Title>
      <ExpandingText
        value={text}
        onChangeText={setText}
        placeholder={question === 'club-fit' ? COPY.clubFitQ : COPY.friendshipQ}
      />
      {notice ? <Notice text={notice} /> : null}
    </Screen>
  );
}
