import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { ChoiceChip } from '@/components/ChoiceChip';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { COPY } from '@/interview/copy';
import { useInterview } from '@/interview/context';
import { looksLikeEmail, schoolFromEmail } from '@/interview/school';
import { LIVING, YEARS, type Living, type Year } from '@/interview/types';
import { colors, fonts } from '@/theme/colors';

export default function SignupScreen() {
  const router = useRouter();
  const { state, completeSignup } = useInterview();
  const [email, setEmail] = useState(state.signup.email);
  const [firstName, setFirstName] = useState(state.signup.firstName);
  const [year, setYear] = useState<Year | null>(state.signup.year);
  const [living, setLiving] = useState<Living | null>(state.signup.living);

  const school = useMemo(() => schoolFromEmail(email), [email]);
  const valid = looksLikeEmail(email) && firstName.trim().length > 0 && year && living;

  return (
    <Screen
      footer={
        <PrimaryButton
          label={COPY.continue}
          disabled={!valid}
          onPress={async () => {
            if (!year || !living) return;
            await completeSignup({ email, firstName, year, living });
            router.push('/interview/taps');
          }}
        />
      }
    >
      <Text style={styles.mark}>Wayve</Text>
      <Text style={styles.question}>School email, first name, year, and whether you live on campus.</Text>
      <Text style={styles.line}>{COPY.friendsNotDating(school)}</Text>

      <Text style={styles.label}>School email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="you@school.edu"
        placeholderTextColor={colors.hint}
        style={styles.field}
      />
      {!email || looksLikeEmail(email) ? null : (
        <Text style={styles.soft}>That doesn’t look like an email yet.</Text>
      )}

      <Text style={styles.label}>First name</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
        placeholder="What people actually call you"
        placeholderTextColor={colors.hint}
        style={styles.field}
      />

      <Text style={styles.label}>Year</Text>
      <View style={styles.wrap}>
        {YEARS.map((item) => (
          <ChoiceChip key={item} label={item} selected={year === item} onPress={() => setYear(item)} />
        ))}
      </View>

      <Text style={styles.label}>Residential or commuter</Text>
      <View style={styles.wrap}>
        {LIVING.map((item) => (
          <ChoiceChip key={item} label={item} selected={living === item} onPress={() => setLiving(item)} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mark: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.ink,
    marginTop: 8,
  },
  question: {
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 32,
    color: colors.ink,
  },
  line: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 22,
    color: colors.forest,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
    marginTop: 8,
  },
  field: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontFamily: fonts.sans,
    fontSize: 17,
    color: colors.ink,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  soft: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.warning,
  },
});
