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
  onReportPerson,
  onBlockPerson,
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
      <View style={styles.head}>
        {onOpen ? (
          <Pressable onPress={onOpen} accessibilityRole="button" style={styles.headText}>
            <Text style={styles.name}>{club.name}</Text>
            <Text style={styles.when}>{club.next_meeting}</Text>
          </Pressable>
        ) : (
          <View style={styles.headText}>
            <Text style={styles.name}>{club.name}</Text>
            <Text style={styles.when}>{club.next_meeting}</Text>
          </View>
        )}
        {club.drop_in_ok ? <Text style={styles.drop}>Drop-in</Text> : null}
      </View>

      {compact ? (
        <Text style={styles.body} numberOfLines={3}>
          {club.first_15_script}
        </Text>
      ) : (
        <>
          <Field label={PLAN_COPY.first15} body={club.first_15_script} />
          <Field label={PLAN_COPY.stayLeave} body={club.stay_leave} />
          <Field label={PLAN_COPY.thisWeek} body={club.weekly_hours} />
          <Field label={PLAN_COPY.notFit} body={club.not_fit_if} />
        </>
      )}

      <Text style={styles.next}>{nextAction}</Text>

      {alsoHere.length ? (
        <View style={styles.alsoWrap}>
          <Text style={styles.alsoLine}>
            {PLAN_COPY.alsoAt}: {alsoHere.map((person) => person.name).join(', ')}
          </Text>
          {!compact
            ? alsoHere.map((person) => (
                <View key={person.id} style={styles.person}>
                  <Text style={styles.personNote}>{person.note}</Text>
                  {onReportPerson || onBlockPerson ? (
                    <View style={styles.row}>
                      {onReportPerson ? (
                        <TextLink label={PLAN_COPY.safetyLink} onPress={() => onReportPerson(person.id)} muted />
                      ) : null}
                      {onBlockPerson ? (
                        <TextLink label={PLAN_COPY.blockLink} onPress={() => onBlockPerson(person.id)} muted />
                      ) : null}
                    </View>
                  ) : null}
                </View>
              ))
            : null}
        </View>
      ) : null}

      {committed ? (
        <Text style={styles.done}>{PLAN_COPY.illGoDone}</Text>
      ) : (
        <PrimaryButton label={PLAN_COPY.illGo} onPress={onIllGo} />
      )}

      <View style={styles.row}>
        {onOpen && compact ? <TextLink label="More" onPress={onOpen} muted /> : null}
        {onReport ? <TextLink label={PLAN_COPY.safetyLink} onPress={onReport} muted /> : null}
        {onBlock ? <TextLink label={PLAN_COPY.blockLink} onPress={onBlock} muted /> : null}
      </View>
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
    gap: 12,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  headText: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 22,
    lineHeight: 28,
    color: colors.ink,
  },
  when: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  drop: {
    fontFamily: fonts.sans,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: colors.forest,
    marginTop: 4,
  },
  field: {
    gap: 4,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: 11,
    fontWeight: '700',
    color: colors.hint,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
  },
  next: {
    fontFamily: fonts.serif,
    fontSize: 16,
    lineHeight: 24,
    color: colors.forest,
  },
  alsoWrap: {
    gap: 8,
  },
  alsoLine: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  person: {
    gap: 4,
  },
  personNote: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
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
