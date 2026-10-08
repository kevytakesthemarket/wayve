import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { CAMPUS_PEOPLE_OPEN_COUNT, usePlan } from '@/plan/context';
import { PLAN_COPY } from '@/plan/copy';
import { PEOPLE_GATE_MIN_INTERVIEWS } from '@/plan/peopleGate';
import { colors, fonts } from '@/theme/colors';

export default function CampusSettingsScreen() {
  const router = useRouter();
  const { campus, peopleOpen, setCampusInterviewCount } = usePlan();

  return (
    <Screen
      extraBottom={24}
      footer={
        peopleOpen ? (
          <PrimaryButton
            label={PLAN_COPY.campusCloseCta}
            muted
            onPress={() => setCampusInterviewCount(0)}
          />
        ) : (
          <PrimaryButton
            label={PLAN_COPY.campusOpenCta}
            onPress={() => setCampusInterviewCount(CAMPUS_PEOPLE_OPEN_COUNT)}
          />
        )
      }
    >
      <TextLink label="Back" onPress={() => router.back()} />
      <Text style={styles.title}>{PLAN_COPY.campusTitle}</Text>
      <Text style={styles.lead}>{PLAN_COPY.campusLead}</Text>

      <View style={styles.stat}>
        <Text style={styles.statValue}>
          {campus.interviewCount} / {PEOPLE_GATE_MIN_INTERVIEWS}
        </Text>
        <Text style={styles.statLabel}>{peopleOpen ? PLAN_COPY.campusOpen : PLAN_COPY.campusClosed}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 34,
    color: colors.ink,
  },
  lead: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
  stat: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 6,
  },
  statLabel: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
  statValue: {
    fontFamily: fonts.serif,
    fontSize: 32,
    color: colors.ink,
  },
});
