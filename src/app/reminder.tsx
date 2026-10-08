import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

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

  return (
    <Screen
      extraBottom={24}
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
          <PrimaryButton label="This week" onPress={() => router.replace('/home')} />
        )
      }
    >
      <TextLink label="Back" onPress={() => router.back()} />
      <Text style={styles.title}>{PLAN_COPY.reminderTitle}</Text>
      {club ? <Text style={styles.club}>{club.name}</Text> : null}

      {body ? (
        <>
          <Text style={styles.body}>{body}</Text>
          {Platform.OS !== 'web' ? (
            <TextLink
              label={PLAN_COPY.reminderPreview}
              onPress={async () => {
                const ok = await previewReminder();
                setPreviewNote(ok ? 'Armed.' : 'Could not schedule.');
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

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 34,
    color: colors.ink,
  },
  club: {
    fontFamily: fonts.sans,
    fontSize: 15,
    fontWeight: '600',
    color: colors.forest,
  },
  body: {
    fontFamily: fonts.serif,
    fontSize: 22,
    lineHeight: 30,
    color: colors.ink,
    marginTop: 4,
  },
  note: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  footerCol: {
    gap: 10,
  },
});
