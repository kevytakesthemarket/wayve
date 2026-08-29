import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTimeHint } from '@/hooks/useTimeHint';
import { colors, fonts } from '@/theme/colors';

export function InterviewChrome({
  step,
  total,
  startedAt,
  onBack,
}: {
  step: number;
  total: number;
  startedAt: number | null;
  onBack?: () => void;
}) {
  const hint = useTimeHint(startedAt);
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={8} accessibilityRole="button">
          <Text style={styles.back}>Back</Text>
        </Pressable>
      ) : (
        <View />
      )}
      <View style={styles.dots}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={[styles.dot, i < step && styles.dotOn]} />
        ))}
      </View>
      <Text style={styles.time} numberOfLines={2}>
        {hint}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  back: {
    color: colors.forest,
    fontFamily: fonts.sans,
    fontSize: 15,
    fontWeight: '600',
    width: 52,
  },
  dots: {
    flexDirection: 'row',
    gap: 5,
    flex: 1,
    justifyContent: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.line,
  },
  dotOn: {
    backgroundColor: colors.forest,
  },
  time: {
    color: colors.hint,
    fontFamily: fonts.sans,
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'right',
    width: 108,
  },
});
