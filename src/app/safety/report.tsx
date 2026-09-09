import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { ExpandingText } from '@/components/ExpandingText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { PLAN_COPY } from '@/plan/copy';
import { usePlan } from '@/plan/context';
import { clubById } from '@/plan/slate';
import { colors, fonts } from '@/theme/colors';

export default function ReportScreen() {
  const router = useRouter();
  const { clubId } = useLocalSearchParams<{ clubId?: string }>();
  const { reportClub, state } = usePlan();
  const club = clubId ? clubById(clubId) : undefined;
  const already = state.safety.some((item) => item.kind === 'report' && item.targetId === clubId);
  const [reason, setReason] = useState('');
  const [done, setDone] = useState(already);

  return (
    <Screen
      extraBottom={32}
      footer={
        done ? (
          <PrimaryButton label="Back to this week" onPress={() => router.replace('/home')} />
        ) : (
          <PrimaryButton
            label={PLAN_COPY.reportSubmit}
            disabled={!club}
            onPress={() => {
              if (!club) return;
              reportClub(club.id, reason);
              setDone(true);
            }}
          />
        )
      }
    >
      <TextLink label="Back" onPress={() => router.back()} />
      <Text style={styles.title}>{PLAN_COPY.reportTitle}</Text>
      <Text style={styles.lead}>{PLAN_COPY.reportLead}</Text>
      {club ? <Text style={styles.club}>{club.name}</Text> : null}

      {done ? (
        <Text style={styles.done}>{PLAN_COPY.reportDone}</Text>
      ) : (
        <ExpandingText
          value={reason}
          onChangeText={setReason}
          placeholder={PLAN_COPY.reportPlaceholder}
        />
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
  lead: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
  },
  club: {
    fontFamily: fonts.sans,
    fontSize: 16,
    fontWeight: '600',
    color: colors.forest,
  },
  done: {
    fontFamily: fonts.serif,
    fontSize: 20,
    lineHeight: 28,
    color: colors.ink,
  },
});
