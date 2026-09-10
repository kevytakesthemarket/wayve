import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ClubCard } from '@/components/ClubCard';
import { FirstPassBadge } from '@/components/FirstPassBadge';
import { Heading } from '@/components/Heading';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
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
        <Heading size="md">This club is not on your plan.</Heading>
      </Screen>
    );
  }

  const nextAction = buildNextAction(club, state);
  const committed = Boolean(commitmentFor(club.id));
  const alsoHere = peopleOpen
    ? (club.also_at_meeting ?? [])
        .map((personId) => personById(personId))
        .filter((person): person is PersonRow => Boolean(person))
        .filter((person) => !isPersonBlocked(person.id))
    : [];

  return (
    <Screen extraBottom={32}>
      <TextLink label="Back to this week" onPress={() => router.back()} />
      <FirstPassBadge />
      <ClubCard
        club={club}
        nextAction={nextAction}
        committed={committed}
        alsoHere={alsoHere}
        onIllGo={() => {
          void commitIllGo(club.id, nextAction);
        }}
        onReport={() => router.push({ pathname: '/safety/report', params: { clubId: club.id } })}
        onBlock={() => router.push({ pathname: '/safety/block', params: { clubId: club.id } })}
        onReportPerson={(personId) => router.push({ pathname: '/safety/report', params: { personId } })}
        onBlockPerson={(personId) => router.push({ pathname: '/safety/block', params: { personId } })}
      />
      {committed ? (
        <View style={styles.links}>
          <TextLink label={PLAN_COPY.reminderLink} onPress={() => router.push('/reminder')} />
          <TextLink label={PLAN_COPY.afterLink} onPress={() => router.push(`/after/${club.id}`)} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  links: {
    gap: 10,
  },
});
