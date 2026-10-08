import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme/colors';

export function InterviewChrome({
  step,
  total,
  onBack,
}: {
  step: number;
  total: number;
  startedAt?: number | null;
  onBack?: () => void;
}) {
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={8} accessibilityRole="button">
          <Text style={styles.back}>Back</Text>
        </Pressable>
      ) : (
        <View />
      )}
      <Text style={styles.step}>
        {step}/{total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    color: colors.ink,
    fontFamily: fonts.sans,
    fontSize: 15,
  },
  step: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 13,
  },
});
