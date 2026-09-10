import { useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/Card';
import { FirstPassBadge } from '@/components/FirstPassBadge';
import { Heading } from '@/components/Heading';
import { InterviewChrome } from '@/components/InterviewChrome';
import { Notice } from '@/components/Notice';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { COPY } from '@/interview/copy';
import { useInterview } from '@/interview/context';
import { PLAN_COPY } from '@/plan/copy';
import { usePlan } from '@/plan/context';
import { scorer } from '@/scoring';
import { colors, fonts } from '@/theme/colors';

export default function UnlockScreen() {
  const router = useRouter();
  const { state } = useInterview();
  const { weekly, peopleOpen } = usePlan();
  const note = scorer.emptyFacetNote(state);

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
      <Heading size="md">{COPY.unlockLead}</Heading>
      <Text style={styles.people}>{peopleOpen ? PLAN_COPY.homePeopleOpen : PLAN_COPY.homePeopleClosed}</Text>

      {state.publicCard ? (
        <Card>
          <Text style={styles.cardLabel}>Your card</Text>
          <Text style={styles.cardBody}>{state.publicCard}</Text>
        </Card>
      ) : null}

      <Text style={styles.section}>Clubs this week</Text>
      {weekly.map((club) => (
        <Card key={club.id}>
          <Text style={styles.clubName}>{club.name}</Text>
          <Text style={styles.clubNote}>{club.next_meeting}</Text>
        </Card>
      ))}

      {note ? <Notice text={note} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  people: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.accent,
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
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 24,
    color: colors.body,
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
  clubName: {
    fontFamily: fonts.serif,
    fontStyle: 'italic',
    fontWeight: '700',
    fontSize: 18,
    color: colors.title,
  },
  clubNote: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
});
