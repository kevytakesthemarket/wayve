import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { FirstPassBadge } from '@/components/FirstPassBadge';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { PLAN_COPY } from '@/plan/copy';
import { usePlan } from '@/plan/context';
import { reminderBody } from '@/plan/reminder';
import { clubById } from '@/plan/slate';
import { colors, fonts } from '@/theme/colors';

export default function ReminderScreen() {
  const router = useRouter();
  const { activeCommitment, state } = usePlan();
  const body = reminderBody(state.reminder, activeCommitment?.nextAction);
  const club = activeCommitment ? clubById(activeCommitment.clubId) : undefined;

  return (
    <Screen
      extraBottom={32}
      footer={
        body && activeCommitment ? (
          <View style={styles.footerCol}>
            <PrimaryButton
              label={PLAN_COPY.reminderWent}
              onPress={() => router.push(`/after/${activeCommitment.clubId}`)}
            />
            <PrimaryButton
              label={PLAN_COPY.reminderNotToday}
              muted
              onPress={() => router.replace('/home')}
            />
          </View>
        ) : (
          <PrimaryButton label="Back to this week" onPress={() => router.replace('/home')} />
        )
      }
    >
      <TextLink label="Back" onPress={() => router.back()} />
      <FirstPassBadge />
      <Text style={styles.title}>{PLAN_COPY.reminderTitle}</Text>
      {club ? <Text style={styles.club}>{club.name}</Text> : null}

      {body ? (
        <>
          <Text style={styles.body}>{body}</Text>
          <Text style={styles.note}>{PLAN_COPY.reminderNote}</Text>
        </>
      ) : (
        <Text style={styles.note}>{PLAN_COPY.reminderEmpty}</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 38,
    color: colors.ink,
  },
  club: {
    fontFamily: fonts.sans,
    fontSize: 16,
    fontWeight: '600',
    color: colors.forest,
  },
  body: {
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 34,
    color: colors.ink,
    marginTop: 8,
  },
  note: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
  footerCol: {
    gap: 10,
  },
});
