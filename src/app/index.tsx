import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { COPY } from '@/interview/copy';
import { useInterview } from '@/interview/context';
import { colors, fonts } from '@/theme/colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const { state, reset } = useInterview();
  const school = state.signup.schoolName && state.signup.schoolName !== 'your school'
    ? state.signup.schoolName
    : 'your campus';
  const hasProgress = state.step !== 'welcome' && (state.signup.firstName || state.startedAt);

  return (
    <Screen
      footer={
        <View style={styles.footerCol}>
          {hasProgress ? (
            <PrimaryButton
              label="Continue where you left off"
              onPress={() => router.push(routeForStep(state.step))}
            />
          ) : null}
          <PrimaryButton
            label={hasProgress ? 'Start over' : COPY.welcomeCta}
            onPress={async () => {
              if (hasProgress) await reset();
              router.push('/signup');
            }}
            muted={!!hasProgress}
          />
        </View>
      }
    >
      <Text style={styles.mark}>Wayve</Text>
      <Text style={styles.kicker}>{COPY.welcomeKicker}</Text>
      <Text style={styles.line}>{COPY.friendsNotDating(school)}</Text>
      <Text style={styles.body}>{COPY.welcomeBody}</Text>
    </Screen>
  );
}

function routeForStep(step: string): '/signup' | '/interview/taps' | '/interview/examples' | '/interview/belonging' | '/interview/thursday' | '/interview/facet' | '/interview/member-check' | '/interview/unlock' {
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
    default:
      return '/signup';
  }
}

const styles = StyleSheet.create({
  mark: {
    marginTop: 48,
    fontFamily: fonts.serif,
    fontSize: 48,
    color: colors.ink,
  },
  kicker: {
    fontFamily: fonts.sans,
    fontSize: 20,
    lineHeight: 28,
    color: colors.ink,
    fontWeight: '600',
  },
  line: {
    fontFamily: fonts.sans,
    fontSize: 17,
    lineHeight: 24,
    color: colors.forest,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 17,
    lineHeight: 26,
    color: colors.muted,
    marginTop: 8,
  },
  footerCol: {
    gap: 10,
  },
});
