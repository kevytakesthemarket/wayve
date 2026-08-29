import { useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { ExampleCard } from '@/components/ExampleCard';
import { InterviewChrome } from '@/components/InterviewChrome';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { COPY, EXAMPLE_PROFILES } from '@/interview/copy';
import { useInterview } from '@/interview/context';
import { colors, fonts } from '@/theme/colors';

export default function ExamplesScreen() {
  const router = useRouter();
  const { state, markStep } = useInterview();

  return (
    <Screen
      footer={
        <PrimaryButton
          label="Got it — I'll write next"
          onPress={() => {
            markStep('belonging');
            router.push('/interview/belonging');
          }}
        />
      }
    >
      <InterviewChrome
        step={2}
        total={6}
        startedAt={state.startedAt}
        onBack={() => router.back()}
      />
      <Text style={styles.q}>{COPY.examplesCaption}</Text>
      {EXAMPLE_PROFILES.map((card) => (
        <ExampleCard key={card.label} label={card.label} body={card.body} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  q: {
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 32,
    color: colors.ink,
    marginBottom: 4,
  },
});
