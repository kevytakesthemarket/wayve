import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Title } from '@/components/Title';
import { useInterview } from '@/interview/context';
import { usePlan } from '@/plan/context';
import { colors, fonts } from '@/theme/colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const { state, reset, markStep } = useInterview();
  const { reset: resetPlan } = usePlan();
  const hasProgress = state.step !== 'welcome' && (state.signup.firstName || state.startedAt);

  return (
    <Screen
      footer={
        <View style={styles.col}>
          {hasProgress ? (
            <PrimaryButton label="Continue" onPress={() => router.push(routeForStep(state.step))} />
          ) : null}
          <PrimaryButton
            label={hasProgress ? 'Start over' : 'Start'}
            muted={!!hasProgress}
            onPress={async () => {
              if (hasProgress) {
                await resetPlan();
                await reset();
              }
              router.push('/signup');
            }}
          />
          <PrimaryButton
            label="Skip to home"
            muted
            onPress={() => {
              markStep('home');
              router.replace('/home');
            }}
          />
        </View>
      }
    >
      <Title>Wayve</Title>
      <Text style={styles.sub}>Friends + clubs. Not dating.</Text>
      <Text style={styles.sub}>Skeleton</Text>
    </Screen>
  );
}

function routeForStep(
  step: string,
):
  | '/signup'
  | '/interview/taps'
  | '/interview/examples'
  | '/interview/belonging'
  | '/interview/thursday'
  | '/interview/facet'
  | '/interview/member-check'
  | '/interview/unlock'
  | '/home' {
  switch (step) {
    case 'taps':
      return '/interview/taps';
    case 'examples':
      return '/interview/examples';
    case 'belonging':
      return '/interview/belonging';
    case 'thursday':
      return '/interview/thursday';
    case 'facet':
      return '/interview/facet';
    case 'member-check':
      return '/interview/member-check';
    case 'unlock':
      return '/interview/unlock';
    case 'home':
      return '/home';
    default:
      return '/signup';
  }
}

const styles = StyleSheet.create({
  sub: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
  col: {
    gap: 8,
  },
});
