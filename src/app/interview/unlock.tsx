import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { FirstPassBadge } from '@/components/FirstPassBadge';
import { InterviewChrome } from '@/components/InterviewChrome';
import { Notice } from '@/components/Notice';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { COPY } from '@/interview/copy';
import { useInterview } from '@/interview/context';
import { PLAN_COPY } from '@/plan/copy';
import { weeklySlate } from '@/plan/slate';
import { scorer } from '@/scoring';
import { colors, fonts } from '@/theme/colors';

export default function UnlockScreen() {
  const router = useRouter();
  const { state } = useInterview();
  const note = scorer.emptyFacetNote(state);
  const clubs = weeklySlate();

  return (
    <Screen
      extraBottom={32}
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
      <Text style={styles.q}>{COPY.unlockLead}</Text>
      <Text style={styles.people}>{PLAN_COPY.homePeopleClosed}</Text>

      {state.publicCard ? (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Your card</Text>
          <Text style={styles.cardBody}>{state.publicCard}</Text>
        </View>
      ) : null}

      <Text style={styles.section}>Clubs this week</Text>
      {clubs.map((club) => (
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
    fontSize: 24,
    lineHeight: 32,
    color: colors.ink,
  },
  people: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.forest,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 6,
  },
  cardLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    color: colors.hint,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cardBody: {
    fontFamily: fonts.serif,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
  section: {
    fontFamily: fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  club: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 4,
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
