import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { ChoiceChip } from '@/components/ChoiceChip';
import { Field } from '@/components/Field';
import { Heading } from '@/components/Heading';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { COPY } from '@/interview/copy';
import { useInterview } from '@/interview/context';
import { usePlan } from '@/plan/context';
import { isSchoolEmail, looksLikeEmail, schoolFromEmail } from '@/interview/school';
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

  const school = useMemo(() => schoolFromEmail(email), [email]);
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
      <Card>
        <Heading size="md">School email, first name, year, and whether you live on campus.</Heading>
        <Text style={styles.line}>{COPY.friendsNotDating(school)}</Text>

        <Field
          label="School email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="you@school.edu"
        />
        {!email || looksLikeEmail(email) ? null : (
          <Text style={styles.soft}>That doesn’t look like an email yet.</Text>
        )}
        {email && looksLikeEmail(email) && !schoolOk ? (
          <Text style={styles.soft}>
            Use a school email (.edu). Personal inboxes are not a campus friends-and-clubs network.
          </Text>
        ) : null}

        <Field
          label="First name"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
          placeholder="What people actually call you"
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
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  line: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 22,
    color: colors.accent,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
    marginTop: 8,
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
