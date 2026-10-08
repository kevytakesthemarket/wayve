import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { TextLink } from '@/components/TextLink';
import { PLAN_COPY } from '@/plan/copy';
import type { PersonRow } from '@/plan/people';
import type { Club } from '@/plan/types';
import { colors, fonts } from '@/theme/colors';

export function ClubCard({
  club,
  nextAction,
  committed,
  onIllGo,
  onOpen,
  onReport,
  onBlock,
  alsoHere = [],
  compact = false,
}: {
  club: Club;
  nextAction: string;
  committed: boolean;
  onIllGo: () => void;
  onOpen?: () => void;
  onReport?: () => void;
  onBlock?: () => void;
  alsoHere?: PersonRow[];
  onReportPerson?: (personId: string) => void;
  onBlockPerson?: (personId: string) => void;
  compact?: boolean;
}) {
  return (
    <View style={styles.card}>
      {onOpen ? (
        <Pressable onPress={onOpen} accessibilityRole="button">
          <Text style={styles.name}>{club.name}</Text>
        </Pressable>
      ) : (
        <Text style={styles.name}>{club.name}</Text>
      )}
      <Text style={styles.meta}>
        {club.next_meeting}
        {club.drop_in_ok ? ' · drop-in' : ''}
      </Text>
      {!compact ? <Text style={styles.meta} numberOfLines={2}>{club.first_15_script}</Text> : null}
      <Text style={styles.meta} numberOfLines={2}>
        {nextAction}
      </Text>
      {alsoHere.length ? (
        <Text style={styles.meta}>
          {PLAN_COPY.alsoAt}: {alsoHere.map((person) => person.name).join(', ')}
        </Text>
      ) : null}
      {committed ? (
        <Text style={styles.done}>{PLAN_COPY.illGoDone}</Text>
      ) : (
        <PrimaryButton label={PLAN_COPY.illGo} onPress={onIllGo} />
      )}
      <View style={styles.row}>
        {onReport ? <TextLink label={PLAN_COPY.safetyLink} onPress={onReport} muted /> : null}
        {onBlock ? <TextLink label={PLAN_COPY.blockLink} onPress={onBlock} muted /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    padding: 12,
    gap: 8,
  },
  name: {
    fontFamily: fonts.sans,
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  meta: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  done: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
});
