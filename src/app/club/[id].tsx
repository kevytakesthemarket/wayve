import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ClubCard } from '@/components/ClubCard';
import { FirstPassBadge } from '@/components/FirstPassBadge';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { useInterview } from '@/interview/context';
import { PLAN_COPY } from '@/plan/copy';
import { usePlan } from '@/plan/context';
import { buildNextAction } from '@/plan/nextAction';
import { clubById } from '@/plan/slate';
import { colors, fonts } from '@/theme/colors';

export default function ClubDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useInterview();
  const { commitIllGo, commitmentFor, isBlocked } = usePlan();
  const club = id ? clubById(id) : undefined;

  if (!club || isBlocked(club.id)) {
    return (
      <Screen>
        <TextLink label="Back" onPress={() => router.back()} />
        <Text style={styles.missing}>This club is not on your plan.</Text>
      </Screen>
    );
  }

  const nextAction = buildNextAction(club, state);
  const committed = Boolean(commitmentFor(club.id));

  return (
    <Screen extraBottom={32}>
      <TextLink label="Back to this week" onPress={() => router.back()} />
      <FirstPassBadge />
      <ClubCard
        club={club}
        nextAction={nextAction}
        committed={committed}
        onIllGo={() => commitIllGo(club.id, nextAction)}
        onReport={() => router.push({ pathname: '/safety/report', params: { clubId: club.id } })}
        onBlock={() => router.push({ pathname: '/safety/block', params: { clubId: club.id } })}
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
  missing: {
    fontFamily: fonts.serif,
    fontSize: 22,
    lineHeight: 30,
    color: colors.ink,
  },
  links: {
    gap: 10,
  },
});
