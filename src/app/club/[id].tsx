import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ClubCard } from '@/components/ClubCard';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { Title } from '@/components/Title';
import { useInterview } from '@/interview/context';
import { PLAN_COPY } from '@/plan/copy';
import { usePlan } from '@/plan/context';
import { buildNextAction } from '@/plan/nextAction';
import { personById, type PersonRow } from '@/plan/people';

export default function ClubDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useInterview();
  const { commitIllGo, commitmentFor, isBlocked, findClub, peopleOpen, isPersonBlocked } = usePlan();
  const club = id ? findClub(id) : undefined;

  if (!club || isBlocked(club.id)) {
    return (
      <Screen>
        <TextLink label="Back" onPress={() => router.back()} />
        <Title>Club</Title>
      </Screen>
    );
  }

  const nextAction = buildNextAction(club, state);
  const alsoHere = peopleOpen
    ? (club.also_at_meeting ?? [])
        .map((personId) => personById(personId))
        .filter((person): person is PersonRow => Boolean(person))
        .filter((person) => !isPersonBlocked(person.id))
    : [];

  return (
    <Screen>
      <TextLink label="Back" onPress={() => router.back()} />
      <Title>Club</Title>
      <ClubCard
        club={club}
        nextAction={nextAction}
        committed={Boolean(commitmentFor(club.id))}
        alsoHere={alsoHere}
        onIllGo={() => {
          void commitIllGo(club.id, nextAction);
        }}
        onReport={() => router.push({ pathname: '/safety/report', params: { clubId: club.id } })}
        onBlock={() => router.push({ pathname: '/safety/block', params: { clubId: club.id } })}
      />
      {commitmentFor(club.id) ? (
        <View style={styles.links}>
          <TextLink label="Reminder" onPress={() => router.push('/reminder')} />
          <TextLink label="After" onPress={() => router.push(`/after/${club.id}`)} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  links: {
    flexDirection: 'row',
    gap: 16,
  },
});
