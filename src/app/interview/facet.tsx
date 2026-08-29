import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { ExpandingText } from '@/components/ExpandingText';
import { InterviewChrome } from '@/components/InterviewChrome';
import { Notice } from '@/components/Notice';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useAnswerGate } from '@/hooks/useAnswerGate';
import { COPY } from '@/interview/copy';
import { useInterview } from '@/interview/context';
import { PROBE_FACET } from '@/scoring/cliches';
import { colors, fonts } from '@/theme/colors';

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
      <Text style={styles.q}>{prompt}</Text>
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  q: {
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 32,
    color: colors.ink,
  },
});
