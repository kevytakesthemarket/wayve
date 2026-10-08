import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { InterviewChrome } from '@/components/InterviewChrome';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Title } from '@/components/Title';
import { useInterview } from '@/interview/context';
import { defaultPublicCard, scorer } from '@/scoring';
import { colors, fonts } from '@/theme/colors';

export default function MemberCheckScreen() {
  const router = useRouter();
  const { state, setSummary } = useInterview();
  const bullets = useMemo(
    () => (state.summaryBullets.length ? state.summaryBullets : scorer.extractBullets(state)),
    [state],
  );
  const [card] = useState(() => state.publicCard || defaultPublicCard(bullets));

  return (
    <Screen
      footer={
        <PrimaryButton
          label="Approve"
          disabled={!card.trim()}
          onPress={() => {
            setSummary(bullets.filter((b) => b.trim()), card.trim());
            router.push('/interview/unlock');
          }}
        />
      }
    >
      <InterviewChrome step={6} total={6} startedAt={state.startedAt} onBack={() => router.back()} />
      <Title>Card</Title>
      <Text style={styles.card}>{card || '—'}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    padding: 12,
  },
});
