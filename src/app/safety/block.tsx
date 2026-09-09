import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { PLAN_COPY } from '@/plan/copy';
import { usePlan } from '@/plan/context';
import { clubById } from '@/plan/slate';
import { colors, fonts } from '@/theme/colors';

export default function BlockScreen() {
  const router = useRouter();
  const { clubId } = useLocalSearchParams<{ clubId?: string }>();
  const { blockClub, isBlocked } = usePlan();
  const club = clubId ? clubById(clubId) : undefined;
  const [done, setDone] = useState(Boolean(clubId && isBlocked(clubId)));

  return (
    <Screen
      extraBottom={32}
      footer={
        done ? (
          <PrimaryButton label="Back to this week" onPress={() => router.replace('/home')} />
        ) : (
          <PrimaryButton
            label={PLAN_COPY.blockConfirm}
            disabled={!club}
            onPress={() => {
              if (!club) return;
              blockClub(club.id);
              setDone(true);
            }}
          />
        )
      }
    >
      <TextLink label="Back" onPress={() => router.back()} />
      <Text style={styles.title}>{PLAN_COPY.blockTitle}</Text>
      <Text style={styles.lead}>{PLAN_COPY.blockLead}</Text>
      {club ? <Text style={styles.club}>{club.name}</Text> : null}
      {done ? <Text style={styles.done}>{PLAN_COPY.blockDone}</Text> : null}
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
