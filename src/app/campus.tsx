import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Notice } from '@/components/Notice';
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
      extraBottom={32}
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
        <Text style={styles.statLabel}>Interview corpus (mock)</Text>
        <Text style={styles.statValue}>
          {campus.interviewCount} / ~{PEOPLE_GATE_MIN_INTERVIEWS}
        </Text>
      </View>

      <Notice text={peopleOpen ? PLAN_COPY.campusOpen : PLAN_COPY.campusClosed} />
      <Text style={styles.note}>
        Opening the gate does not add a people grid or a message box. Home stays clubs. A club card may then
        name who is also at that meeting.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 38,
    color: colors.ink,
  },
  lead: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
  },
  stat: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 6,
  },
  statLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    color: colors.hint,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.ink,
  },
  note: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
});
