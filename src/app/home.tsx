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
import { personById, type PersonRow } from '@/plan/people';
import { scorer } from '@/scoring';
import { colors, fonts } from '@/theme/colors';

export default function HomeScreen() {
  const router = useRouter();
  const { state, reset, markStep } = useInterview();
  const {
    weekly,
    peopleOpen,
    reset: resetPlan,
    commitIllGo,
    commitmentFor,
    activeCommitment,
    isPersonBlocked,
  } = usePlan();
  const gap = scorer.emptyFacetNote(state);

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
      <Text style={styles.people}>{peopleOpen ? PLAN_COPY.homePeopleOpen : PLAN_COPY.homePeopleClosed}</Text>

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

      {weekly.length === 0 ? (
        <Notice text="No clubs on this plan. Blocked rooms stay off the list — we will not invent a replacement." />
      ) : null}

      {weekly.map((club) => {
        const nextAction = buildNextAction(club, state);
        const committed = Boolean(commitmentFor(club.id));
        const alsoHere = peopleOpen
          ? (club.also_at_meeting ?? [])
              .map((id) => personById(id))
              .filter((person): person is PersonRow => Boolean(person))
              .filter((person) => !isPersonBlocked(person.id))
          : [];
        return (
          <ClubCard
            key={club.id}
            club={club}
            nextAction={nextAction}
            committed={committed}
            alsoHere={alsoHere}
            onIllGo={() => {
              void commitIllGo(club.id, nextAction);
            }}
            onOpen={() => router.push(`/club/${club.id}`)}
            onReport={() => router.push({ pathname: '/safety/report', params: { clubId: club.id } })}
            onBlock={() => router.push({ pathname: '/safety/block', params: { clubId: club.id } })}
            onReportPerson={(personId) =>
              router.push({ pathname: '/safety/report', params: { personId } })
            }
            onBlockPerson={(personId) =>
              router.push({ pathname: '/safety/block', params: { personId } })
            }
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

      <View style={styles.links}>
        <TextLink label={PLAN_COPY.officerLink} onPress={() => router.push('/officer')} />
        <TextLink label={PLAN_COPY.campusLink} onPress={() => router.push('/campus')} muted />
      </View>
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
