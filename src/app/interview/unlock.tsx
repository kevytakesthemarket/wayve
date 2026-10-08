import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { InterviewChrome } from '@/components/InterviewChrome';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Title } from '@/components/Title';
import { useInterview } from '@/interview/context';
import { usePlan } from '@/plan/context';
import { colors, fonts } from '@/theme/colors';

export default function UnlockScreen() {
  const router = useRouter();
  const { state } = useInterview();
  const { weekly } = usePlan();

  return (
    <Screen
      footer={<PrimaryButton label="Home" onPress={() => router.replace('/home')} />}
    >
      <InterviewChrome step={6} total={6} startedAt={state.startedAt} />
      <Title>Unlock</Title>
      {weekly.map((club) => (
        <View key={club.id} style={styles.row}>
          <Text style={styles.name}>{club.name}</Text>
          <Text style={styles.meta}>{club.next_meeting}</Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    padding: 12,
    gap: 2,
  },
  name: {
    fontFamily: fonts.sans,
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  meta: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },
});
