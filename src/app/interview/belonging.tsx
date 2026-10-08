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
import { PROBE_BELONGING } from '@/scoring/cliches';

export default function BelongingScreen() {
  const router = useRouter();
  const { state, setBelonging } = useInterview();
  const [text, setText] = useState(state.belonging.text);
  const { notice, submit } = useAnswerGate(PROBE_BELONGING);

  return (
    <Screen
      footer={
        <PrimaryButton
          label={COPY.continue}
          disabled={!text.trim()}
          onPress={() => {
            const answer = submit(text);
            if (!answer) return;
            setBelonging(answer);
            router.push('/interview/thursday');
          }}
        />
      }
    >
      <InterviewChrome step={3} total={6} startedAt={state.startedAt} onBack={() => router.back()} />
      <Title>Belonging</Title>
      <ExpandingText
        value={text}
        onChangeText={setText}
        placeholder={COPY.belongingQ}
      />
      {notice ? <Notice text={notice} /> : null}
    </Screen>
  );
}
