import { useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { Title } from '@/components/Title';
import { CAMPUS_PEOPLE_OPEN_COUNT, usePlan } from '@/plan/context';
import { PLAN_COPY } from '@/plan/copy';
import { colors, fonts } from '@/theme/colors';

export default function CampusSettingsScreen() {
  const router = useRouter();
  const { campus, peopleOpen, setCampusInterviewCount } = usePlan();

  return (
    <Screen
      footer={
        <PrimaryButton
          label={peopleOpen ? PLAN_COPY.campusCloseCta : PLAN_COPY.campusOpenCta}
          onPress={() => setCampusInterviewCount(peopleOpen ? 0 : CAMPUS_PEOPLE_OPEN_COUNT)}
        />
      }
    >
      <TextLink label="Back" onPress={() => router.back()} />
      <Title>Campus</Title>
      <Text style={styles.meta}>
        Interviews: {campus.interviewCount} · {peopleOpen ? 'people open' : 'people closed'}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
});
