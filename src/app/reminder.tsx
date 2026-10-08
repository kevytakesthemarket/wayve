import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { Title } from '@/components/Title';
import { PLAN_COPY } from '@/plan/copy';
import { usePlan } from '@/plan/context';
import { reminderBody } from '@/plan/reminder';
import { colors, fonts } from '@/theme/colors';

export default function ReminderScreen() {
  const router = useRouter();
  const { activeCommitment, state, findClub } = usePlan();
  const body = reminderBody(state.reminder, activeCommitment?.nextAction);
  const club = activeCommitment ? findClub(activeCommitment.clubId) : undefined;

  return (
    <Screen
      footer={
        body && activeCommitment ? (
          <View style={styles.col}>
            <PrimaryButton
              label={PLAN_COPY.reminderWent}
              onPress={() => router.push(`/after/${activeCommitment.clubId}`)}
            />
            <PrimaryButton label={PLAN_COPY.reminderNotToday} muted onPress={() => router.replace('/home')} />
          </View>
        ) : (
          <PrimaryButton label="Home" onPress={() => router.replace('/home')} />
        )
      }
    >
      <TextLink label="Back" onPress={() => router.back()} />
      <Title>Reminder</Title>
      {club ? <Text style={styles.meta}>{club.name}</Text> : null}
      <Text style={styles.body}>{body ?? PLAN_COPY.reminderEmpty}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
  col: {
    gap: 8,
  },
});
