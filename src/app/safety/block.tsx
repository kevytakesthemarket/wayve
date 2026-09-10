import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/Card';
import { Heading } from '@/components/Heading';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { PLAN_COPY } from '@/plan/copy';
import { usePlan } from '@/plan/context';
import { personById } from '@/plan/people';
import { colors, fonts } from '@/theme/colors';

export default function BlockScreen() {
  const router = useRouter();
  const { clubId, personId } = useLocalSearchParams<{ clubId?: string; personId?: string }>();
  const { blockClub, blockPerson, isBlocked, isPersonBlocked, findClub } = usePlan();
  const club = clubId ? findClub(clubId) : undefined;
  const person = personId ? personById(personId) : undefined;
  const [done, setDone] = useState(
    Boolean((clubId && isBlocked(clubId)) || (personId && isPersonBlocked(personId))),
  );

  const label = person ? PLAN_COPY.blockConfirmPerson : PLAN_COPY.blockConfirm;
  const lead = person ? PLAN_COPY.blockLeadPerson : PLAN_COPY.blockLead;
  const doneCopy = person ? PLAN_COPY.blockDonePerson : PLAN_COPY.blockDone;

  return (
    <Screen
      extraBottom={32}
      footer={
        done ? (
          <PrimaryButton label="Back to this week" onPress={() => router.replace('/home')} />
        ) : (
          <PrimaryButton
            label={label}
            disabled={!club && !person}
            onPress={() => {
              if (person) blockPerson(person.id);
              else if (club) blockClub(club.id);
              else return;
              setDone(true);
            }}
          />
        )
      }
    >
      <TextLink label="Back" onPress={() => router.back()} />
      <Heading>{PLAN_COPY.blockTitle}</Heading>
      <Text style={styles.lead}>{lead}</Text>
      <Card>
        {person ? <Text style={styles.club}>{person.name}</Text> : null}
        {club ? <Text style={styles.club}>{club.name}</Text> : null}
        {done ? <Text style={styles.done}>{doneCopy}</Text> : null}
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
