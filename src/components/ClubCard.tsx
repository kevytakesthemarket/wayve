import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { TextLink } from '@/components/TextLink';
import { PLAN_COPY } from '@/plan/copy';
import { isPeopleGateOpen } from '@/plan/peopleGate';
import { personById } from '@/plan/people';
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
  interviewCount = 0,
}: {
  club: Club;
  nextAction: string;
  committed: boolean;
  onIllGo: () => void;
  onOpen?: () => void;
  onReport?: () => void;
  onBlock?: () => void;
  interviewCount?: number;
}) {
  const also =
    isPeopleGateOpen(interviewCount) && club.also_at_meeting?.length
      ? club.also_at_meeting.map((id) => personById(id)?.name).filter(Boolean)
      : [];

  return (
    <View style={styles.card}>
      {onOpen ? (
        <Pressable onPress={onOpen} accessibilityRole="button">
          <Text style={styles.name}>{club.name}</Text>
        </Pressable>
      ) : (
        <Text style={styles.name}>{club.name}</Text>
      )}

      <Field label={PLAN_COPY.first15} body={club.first_15_script} />
      <Field label={PLAN_COPY.stayLeave} body={club.stay_leave} />
      <Field label={PLAN_COPY.thisWeek} body={club.weekly_hours} />
      <Field label={PLAN_COPY.nextMeeting} body={club.next_meeting} />
      <Field label={PLAN_COPY.notFit} body={club.not_fit_if} />
      <Field label={PLAN_COPY.ifThen} body={nextAction} />

      {club.drop_in_ok ? <Text style={styles.drop}>{PLAN_COPY.dropIn}</Text> : null}

      {also.length ? (
        <Text style={styles.also}>
          {PLAN_COPY.alsoAt}: {also.join(', ')}
        </Text>
      ) : null}

      {committed ? (
        <Text style={styles.done}>{PLAN_COPY.illGoDone}</Text>
      ) : (
        <PrimaryButton label={PLAN_COPY.illGo} onPress={onIllGo} />
      )}

      {onReport || onBlock ? (
        <View style={styles.row}>
          {onReport ? <TextLink label={PLAN_COPY.safetyLink} onPress={onReport} muted /> : null}
          {onBlock ? <TextLink label={PLAN_COPY.blockLink} onPress={onBlock} muted /> : null}
        </View>
      ) : null}
    </View>
  );
}

function Field({ label, body }: { label: string; body: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 16,
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 30,
    color: colors.ink,
  },
  field: {
    gap: 6,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    color: colors.hint,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
  drop: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.forest,
    fontWeight: '600',
  },
  also: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
  done: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.forest,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
});
