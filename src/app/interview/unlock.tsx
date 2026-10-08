import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { FirstPassBadge } from '@/components/FirstPassBadge';
import { InterviewChrome } from '@/components/InterviewChrome';
import { Notice } from '@/components/Notice';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useInterview } from '@/interview/context';
import { PLAN_COPY } from '@/plan/copy';
import { usePlan } from '@/plan/context';
import { scorer } from '@/scoring';
import { colors, fonts } from '@/theme/colors';

export default function UnlockScreen() {
  const router = useRouter();
  const { state } = useInterview();
  const { weekly } = usePlan();
  const note = scorer.emptyFacetNote(state);

  return (
    <Screen
      extraBottom={24}
      footer={
        <PrimaryButton
          label={PLAN_COPY.unlockCta}
          onPress={() => {
            router.replace('/home');
          }}
        />
      }
    >
      <InterviewChrome step={6} total={6} startedAt={state.startedAt} />
      <FirstPassBadge />
      <Text style={styles.q}>{PLAN_COPY.unlockLead}</Text>

      {weekly.map((club) => (
        <View key={club.id} style={styles.club}>
          <Text style={styles.clubName}>{club.name}</Text>
          <Text style={styles.clubNote}>{club.next_meeting}</Text>
        </View>
      ))}

      {note ? <Notice text={note} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  q: {
    fontFamily: fonts.serif,
    fontSize: 26,
    lineHeight: 32,
    color: colors.ink,
  },
  club: {
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 2,
  },
  clubName: {
    fontFamily: fonts.sans,
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  clubNote: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
});
