import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { ExpandingText } from '@/components/ExpandingText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { Title } from '@/components/Title';
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
          <PrimaryButton label="Home" onPress={() => router.replace('/home')} />
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
      <Title>Report</Title>
      {person ? <Text style={styles.target}>{person.name}</Text> : null}
      {club ? <Text style={styles.target}>{club.name}</Text> : null}

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
  target: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
  done: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
  },
});
