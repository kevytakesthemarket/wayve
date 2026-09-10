import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

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
import { PROBE_THURSDAY } from '@/scoring/cliches';
import { colors, fonts } from '@/theme/colors';

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
      <Card variant="form">
        <Heading size="md">{COPY.thursdayQ}</Heading>
        <Text style={styles.helper}>{COPY.thursdayHelper}</Text>
        <ExpandingText
          value={text}
          onChangeText={setText}
          placeholder="Last class, then what. Who was around. When you wanted out."
        />
        {notice ? <Notice text={notice} /> : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  helper: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
});
