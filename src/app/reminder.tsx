import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { FirstPassBadge } from '@/components/FirstPassBadge';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { PLAN_COPY } from '@/plan/copy';
import { usePlan } from '@/plan/context';
import { reminderBody } from '@/plan/reminder';
import { colors, fonts } from '@/theme/colors';

export default function ReminderScreen() {
  const router = useRouter();
  const { activeCommitment, state, previewReminder, findClub } = usePlan();
  const body = reminderBody(state.reminder, activeCommitment?.nextAction);
  const club = activeCommitment ? findClub(activeCommitment.clubId) : undefined;
  const [previewNote, setPreviewNote] = useState<string | null>(null);

  const notifyLine = notifyCopy(state.reminder?.notificationReason, Boolean(state.reminder?.notificationId));

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
          <Text style={styles.note}>{notifyLine}</Text>
          {Platform.OS !== 'web' && body ? (
            <TextLink
              label={PLAN_COPY.reminderPreview}
              onPress={async () => {
                const ok = await previewReminder();
                setPreviewNote(
                  ok
                    ? 'Preview armed with the same if-then. Check the notification in a few seconds.'
                    : 'Could not schedule a preview. This screen still holds the same line.',
                );
              }}
            />
          ) : null}
          {previewNote ? <Text style={styles.note}>{previewNote}</Text> : null}
        </>
      ) : (
        <Text style={styles.note}>{PLAN_COPY.reminderEmpty}</Text>
      )}
    </Screen>
  );
}

function notifyCopy(reason: 'web' | 'denied' | 'unavailable' | undefined, armed: boolean): string {
  if (armed) return PLAN_COPY.reminderNotifyArmed;
  if (reason === 'denied') return PLAN_COPY.reminderNotifyDenied;
  return PLAN_COPY.reminderNotifyWeb;
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
