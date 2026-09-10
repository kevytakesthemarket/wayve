import { useRouter } from 'expo-router';

import { ExampleCard } from '@/components/ExampleCard';
import { Heading } from '@/components/Heading';
import { InterviewChrome } from '@/components/InterviewChrome';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { COPY, EXAMPLE_PROFILES } from '@/interview/copy';
import { useInterview } from '@/interview/context';

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
      <Heading size="md">{COPY.examplesCaption}</Heading>
      {EXAMPLE_PROFILES.map((card) => (
        <ExampleCard key={card.label} label={card.label} body={card.body} />
      ))}
    </Screen>
  );
}
