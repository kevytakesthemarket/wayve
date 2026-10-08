import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { Title } from '@/components/Title';
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
  const doneCopy = person ? PLAN_COPY.blockDonePerson : PLAN_COPY.blockDone;

  return (
    <Screen
      extraBottom={32}
      footer={
        done ? (
          <PrimaryButton label="Home" onPress={() => router.replace('/home')} />
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
      <Title>Block</Title>
      {person ? <Text style={styles.target}>{person.name}</Text> : null}
      {club ? <Text style={styles.target}>{club.name}</Text> : null}
      {done ? <Text style={styles.done}>{doneCopy}</Text> : null}
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
