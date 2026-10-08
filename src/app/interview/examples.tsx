import { useRouter } from 'expo-router';

import { ExampleCard } from '@/components/ExampleCard';
import { InterviewChrome } from '@/components/InterviewChrome';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Title } from '@/components/Title';
import { EXAMPLE_PROFILES } from '@/interview/copy';
import { useInterview } from '@/interview/context';

export default function ExamplesScreen() {
  const router = useRouter();
  const { state, markStep } = useInterview();

  return (
    <Screen
      footer={
        <PrimaryButton
          label="Continue"
          onPress={() => {
            markStep('belonging');
            router.push('/interview/belonging');
          }}
        />
      }
    >
      <InterviewChrome step={2} total={6} startedAt={state.startedAt} onBack={() => router.back()} />
      <Title>Examples</Title>
      {EXAMPLE_PROFILES.map((card) => (
        <ExampleCard key={card.label} label={card.label} />
      ))}
    </Screen>
  );
}
