import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { ChoiceChip } from '@/components/ChoiceChip';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Title } from '@/components/Title';
import { COPY } from '@/interview/copy';
import { useInterview } from '@/interview/context';
import { usePlan } from '@/plan/context';
import { isSchoolEmail, looksLikeEmail } from '@/interview/school';
import { LIVING, YEARS, type Living, type Year } from '@/interview/types';
import { colors, fonts } from '@/theme/colors';

export default function SignupScreen() {
  const router = useRouter();
  const { state, completeSignup } = useInterview();
  const { reset: resetPlan } = usePlan();
  const [email, setEmail] = useState(state.signup.email);
  const [firstName, setFirstName] = useState(state.signup.firstName);
  const [year, setYear] = useState<Year | null>(state.signup.year);
  const [living, setLiving] = useState<Living | null>(state.signup.living);

  const schoolOk = isSchoolEmail(email);
  const valid = schoolOk && firstName.trim().length > 0 && year && living;

  return (
    <Screen
      footer={
        <PrimaryButton
          label={COPY.continue}
          disabled={!valid}
          onPress={async () => {
            if (!year || !living || !schoolOk) return;
            await resetPlan();
            await completeSignup({ email, firstName, year, living });
            router.push('/interview/taps');
          }}
        />
      }
    >
      <Title>Signup</Title>
      <Text style={styles.sub}>School email. Friends + clubs, not dating.</Text>

      <Text style={styles.label}>Email</Text>
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
      {email && looksLikeEmail(email) && !schoolOk ? (
        <Text style={styles.soft}>Need .edu</Text>
      ) : null}

      <Text style={styles.label}>First name</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
        placeholder="Name"
        placeholderTextColor={colors.hint}
        style={styles.field}
      />

      <Text style={styles.label}>Year</Text>
      <View style={styles.wrap}>
        {YEARS.map((item) => (
          <ChoiceChip key={item} label={item} selected={year === item} onPress={() => setYear(item)} />
        ))}
      </View>

      <Text style={styles.label}>Living</Text>
      <View style={styles.wrap}>
        {LIVING.map((item) => (
          <ChoiceChip key={item} label={item} selected={living === item} onPress={() => setLiving(item)} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sub: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },
  field: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fonts.sans,
    fontSize: 16,
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
