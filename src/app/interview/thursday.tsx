import { useRouter } from 'expo-router';
import { useState } from 'react';

import { ExpandingText } from '@/components/ExpandingText';
import { InterviewChrome } from '@/components/InterviewChrome';
import { Notice } from '@/components/Notice';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Title } from '@/components/Title';
import { useAnswerGate } from '@/hooks/useAnswerGate';
import { COPY } from '@/interview/copy';
import { useInterview } from '@/interview/context';
import { PROBE_THURSDAY } from '@/scoring/cliches';

export default function ThursdayScreen() {
  const router = useRouter();
  const { state, setThursday } = useInterview();
  const [text, setText] = useState(state.thursday.text);
  const { notice, submit } = useAnswerGate(PROBE_THURSDAY);

  return (
    <Screen
      footer={
        <PrimaryButton
          label={COPY.continue}
          disabled={!text.trim()}
          onPress={() => {
            const answer = submit(text);
            if (!answer) return;
            const { next } = setThursday(answer);
            router.push(next === 'facet' ? '/interview/facet' : '/interview/member-check');
          }}
        />
      }
    >
      <InterviewChrome step={4} total={6} startedAt={state.startedAt} onBack={() => router.back()} />
      <Title>Thursday</Title>
      <ExpandingText value={text} onChangeText={setText} placeholder={COPY.thursdayQ} />
      {notice ? <Notice text={notice} /> : null}
    </Screen>
  );
}
