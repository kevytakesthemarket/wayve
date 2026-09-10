import { StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/theme/colors';

export function WayveMark({ size = 'lg' }: { size?: 'lg' | 'md' }) {
  return (
    <Text style={[styles.mark, size === 'md' && styles.md]} accessibilityRole="header">
      Wayve
    </Text>
  );
}

const styles = StyleSheet.create({
  mark: {
    marginTop: 36,
    fontFamily: fonts.serif,
    fontStyle: 'italic',
    fontSize: 52,
    lineHeight: 58,
    color: colors.forest,
    letterSpacing: 0.4,
  },
  md: {
    marginTop: 8,
    fontSize: 32,
    lineHeight: 38,
  },
});
