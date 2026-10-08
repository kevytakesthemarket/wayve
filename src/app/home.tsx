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
      extraBottom={24}
      footer={
        <View style={styles.footerCol}>
          {activeCommitment ? (
            <PrimaryButton
              label={PLAN_COPY.reminderLink}
              onPress={() => router.push('/reminder')}
            />
          ) : null}
          <PrimaryButton
            label="Start over"
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
      <View style={styles.top}>
        <FirstPassBadge />
        <Text style={styles.kicker}>{PLAN_COPY.homeKicker}</Text>
      </View>

      {gap ? <Notice text={gap} /> : null}

      {weekly.length === 0 ? (
        <Notice text="No clubs this week. Blocked rooms stay off — we will not invent a replacement." />
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
            compact
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
          />
        );
      })}

      <View style={styles.links}>
        {state.publicCard ? (
          <TextLink label={PLAN_COPY.editCard} onPress={() => router.push('/card')} muted />
        ) : null}
        {activeCommitment ? (
          <TextLink
            label={PLAN_COPY.afterLink}
            onPress={() => router.push(`/after/${activeCommitment.clubId}`)}
            muted
          />
        ) : null}
        <TextLink label={PLAN_COPY.officerLink} onPress={() => router.push('/officer')} muted />
        <TextLink label={PLAN_COPY.campusLink} onPress={() => router.push('/campus')} muted />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    gap: 10,
    marginBottom: 4,
  },
  kicker: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 34,
    color: colors.ink,
  },
  links: {
    marginTop: 8,
    gap: 10,
  },
  footerCol: {
    gap: 10,
  },
});
