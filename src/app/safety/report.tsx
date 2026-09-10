import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/Card';
import { ExpandingText } from '@/components/ExpandingText';
import { Heading } from '@/components/Heading';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { PLAN_COPY } from '@/plan/copy';
import { usePlan } from '@/plan/context';
import { personById } from '@/plan/people';
import { colors, fonts } from '@/theme/colors';

export default function ReportScreen() {
  const router = useRouter();
  const { clubId, personId } = useLocalSearchParams<{ clubId?: string; personId?: string }>();
  const { reportTarget, reportClub, state, findClub } = usePlan();
  const club = clubId ? findClub(clubId) : undefined;
  const person = personId ? personById(personId) : undefined;
  const targetId = person?.id ?? club?.id;
  const targetType = person ? 'person' : 'club';
  const already = state.safety.some(
    (item) => item.kind === 'report' && item.targetId === targetId && item.targetType === targetType,
  );
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
            disabled={!targetId}
            onPress={() => {
              if (!targetId) return;
              if (person) reportTarget('person', person.id, reason);
              else if (club) reportClub(club.id, reason);
              setDone(true);
            }}
          />
        )
      }
    >
      <TextLink label="Back" onPress={() => router.back()} />
      <Heading>{PLAN_COPY.reportTitle}</Heading>
      <Text style={styles.lead}>{PLAN_COPY.reportLead}</Text>
      {person ? <Text style={styles.club}>{person.name}</Text> : null}
      {club ? <Text style={styles.club}>{club.name}</Text> : null}

      <Card>
        {done ? (
          <Text style={styles.done}>{PLAN_COPY.reportDone}</Text>
        ) : (
          <ExpandingText
            value={reason}
            onChangeText={setReason}
            placeholder={PLAN_COPY.reportPlaceholder}
          />
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
    color: colors.accent,
  },
  done: {
    fontFamily: fonts.serif,
    fontStyle: 'italic',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 28,
    color: colors.title,
  },
});
