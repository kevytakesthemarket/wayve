import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Heading } from '@/components/Heading';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { COPY } from '@/interview/copy';
import { useInterview } from '@/interview/context';
import { usePlan } from '@/plan/context';
import { colors, fonts } from '@/theme/colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const { state, reset } = useInterview();
  const { reset: resetPlan } = usePlan();
  const school = state.signup.schoolName && state.signup.schoolName !== 'your school'
    ? state.signup.schoolName
    : 'your campus';
  const hasProgress = state.step !== 'welcome' && (state.signup.firstName || state.startedAt);

  return (
    <Screen>
      <Card>
        <Heading size="xl" align="center">
          Welcome To Wayve
        </Heading>
        <Text style={styles.kicker}>{COPY.welcomeKicker}</Text>
        <Text style={styles.line}>{COPY.friendsNotDating(school)}</Text>
        <Text style={styles.body}>{COPY.welcomeBody}</Text>
        <View style={styles.cta}>
          {hasProgress ? (
            <PrimaryButton
              label="Continue where you left off"
              onPress={() => router.push(routeForStep(state.step))}
            />
          ) : null}
          <PrimaryButton
            label={hasProgress ? 'Start over' : COPY.welcomeCta}
            onPress={async () => {
              if (hasProgress) {
                await resetPlan();
                await reset();
              }
              router.push('/signup');
            }}
            muted={!!hasProgress}
          />
        </View>
      </Card>
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
  kicker: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 22,
    color: colors.body,
    textAlign: 'center',
  },
  line: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
    textAlign: 'center',
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 22,
    color: colors.body,
    textAlign: 'center',
  },
  cta: {
    gap: 12,
    marginTop: 8,
  },
});
