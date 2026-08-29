import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { InterviewChrome } from '@/components/InterviewChrome';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { COPY } from '@/interview/copy';
import { useInterview } from '@/interview/context';
import { MOCK_CLUBS, MOCK_PEOPLE } from '@/interview/mockMatches';
import { scorer } from '@/scoring';
import { colors, fonts } from '@/theme/colors';

export default function UnlockScreen() {
  const router = useRouter();
  const { state, reset } = useInterview();
  const note = scorer.emptyFacetNote(state);

  return (
    <Screen
      extraBottom={32}
      footer={
        <PrimaryButton
          label="Start another first pass"
          muted
          onPress={async () => {
            await reset();
            router.replace('/');
          }}
        />
      }
    >
      <InterviewChrome step={6} total={6} startedAt={state.startedAt} />
      <Text style={styles.kicker}>{COPY.firstPass}</Text>
      <Text style={styles.q}>{COPY.unlockLead}</Text>

      {state.publicCard ? (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Your card</Text>
          <Text style={styles.cardBody}>{state.publicCard}</Text>
        </View>
      ) : null}

      <Text style={styles.section}>People</Text>
      {MOCK_PEOPLE.map((person) => (
        <View key={person.name} style={styles.match}>
          <View style={styles.avatar}>
            <Text style={styles.initials}>{person.initials}</Text>
          </View>
          <View style={styles.matchBody}>
            <Text style={styles.matchName}>
              {person.name} · {person.year}
            </Text>
            <Text style={styles.matchNote}>{person.note}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.section}>Clubs</Text>
      {MOCK_CLUBS.map((club) => (
        <View key={club.name} style={styles.club}>
          <Text style={styles.matchName}>{club.name}</Text>
          <Text style={styles.matchNote}>{club.note}</Text>
        </View>
      ))}

      {note ? <Text style={styles.honest}>{note}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    alignSelf: 'flex-start',
    fontFamily: fonts.sans,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: colors.firstPass,
    borderWidth: 1,
    borderColor: colors.firstPass,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  q: {
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 32,
    color: colors.ink,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 6,
  },
  cardLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    color: colors.hint,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cardBody: {
    fontFamily: fonts.serif,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
  section: {
    fontFamily: fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  match: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.paperDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.forest,
  },
  matchBody: {
    flex: 1,
    gap: 4,
  },
  matchName: {
    fontFamily: fonts.sans,
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  matchNote: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  club: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 4,
  },
  honest: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.warning,
    marginTop: 8,
  },
});
