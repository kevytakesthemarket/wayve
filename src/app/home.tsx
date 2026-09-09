import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ClubCard } from '@/components/ClubCard';
import { FirstPassBadge } from '@/components/FirstPassBadge';
import { Notice } from '@/components/Notice';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { useInterview } from '@/interview/context';
import { PLAN_COPY } from '@/plan/copy';
import { usePlan } from '@/plan/context';
import { buildNextAction } from '@/plan/nextAction';
import { weeklySlate } from '@/plan/slate';
import { scorer } from '@/scoring';
import { colors, fonts } from '@/theme/colors';

export default function HomeScreen() {
  const router = useRouter();
  const { state, reset, markStep } = useInterview();
  const { state: plan, reset: resetPlan, commitIllGo, commitmentFor, activeCommitment } = usePlan();
  const gap = scorer.emptyFacetNote(state);
  const clubs = weeklySlate(undefined, plan.blockedClubIds);

  useEffect(() => {
    markStep('home');
  }, [markStep]);

  return (
    <Screen
      extraBottom={32}
      footer={
        <View style={styles.footerCol}>
          {activeCommitment ? (
            <PrimaryButton
              label={PLAN_COPY.reminderLink}
              onPress={() => router.push('/reminder')}
            />
          ) : null}
          <PrimaryButton
            label="Start another first pass"
            muted
            onPress={async () => {
              await resetPlan();
              await reset();
              router.replace('/');
            }}
          />
        </View>
      }
    >
      <FirstPassBadge />
      <Text style={styles.kicker}>{PLAN_COPY.homeKicker}</Text>
      <Text style={styles.lead}>{PLAN_COPY.homeLead}</Text>
      <Text style={styles.people}>{PLAN_COPY.homePeopleClosed}</Text>

      {state.publicCard ? (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Your card</Text>
          <Text style={styles.cardBody}>{state.publicCard}</Text>
          <TextLink label={PLAN_COPY.editCard} onPress={() => router.push('/card')} />
        </View>
      ) : (
        <TextLink label={PLAN_COPY.editCard} onPress={() => router.push('/card')} />
      )}

      {gap ? <Notice text={gap} /> : null}

      {clubs.length === 0 ? (
        <Notice text="No clubs on this plan. Blocked rooms stay off the list — we will not invent a replacement." />
      ) : null}

      {clubs.map((club) => {
        const nextAction = buildNextAction(club, state);
        const committed = Boolean(commitmentFor(club.id));
        return (
          <ClubCard
            key={club.id}
            club={club}
            nextAction={nextAction}
            committed={committed}
            onIllGo={() => commitIllGo(club.id, nextAction)}
            onOpen={() => router.push(`/club/${club.id}`)}
            onReport={() => router.push({ pathname: '/safety/report', params: { clubId: club.id } })}
            onBlock={() => router.push({ pathname: '/safety/block', params: { clubId: club.id } })}
          />
        );
      })}

      {activeCommitment ? (
        <View style={styles.links}>
          <TextLink
            label={PLAN_COPY.afterLink}
            onPress={() => router.push(`/after/${activeCommitment.clubId}`)}
          />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 38,
    color: colors.ink,
  },
  lead: {
    fontFamily: fonts.sans,
    fontSize: 17,
    lineHeight: 26,
    color: colors.muted,
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
    gap: 8,
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
  links: {
    marginTop: 4,
    gap: 8,
  },
  footerCol: {
    gap: 10,
  },
});
