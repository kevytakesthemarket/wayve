import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { ClubCard } from '@/components/ClubCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { Title } from '@/components/Title';
import { useInterview } from '@/interview/context';
import { PLAN_COPY } from '@/plan/copy';
import { usePlan } from '@/plan/context';
import { buildNextAction } from '@/plan/nextAction';
import { personById, type PersonRow } from '@/plan/people';

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

  useEffect(() => {
    markStep('home');
  }, [markStep]);

  return (
    <Screen
      footer={
        <View style={styles.col}>
          {activeCommitment ? (
            <PrimaryButton label="Reminder" onPress={() => router.push('/reminder')} />
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
      <Title>Home</Title>

      {weekly.map((club) => {
        const nextAction = buildNextAction(club, state);
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
            committed={Boolean(commitmentFor(club.id))}
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
        <TextLink label="Card" onPress={() => router.push('/card')} muted />
        {activeCommitment ? (
          <TextLink label="After" onPress={() => router.push(`/after/${activeCommitment.clubId}`)} muted />
        ) : null}
        <TextLink label={PLAN_COPY.officerLink} onPress={() => router.push('/officer')} muted />
        <TextLink label={PLAN_COPY.campusLink} onPress={() => router.push('/campus')} muted />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
  col: {
    gap: 8,
  },
});
