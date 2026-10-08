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
    marginTop: 24,
    fontFamily: fonts.serif,
    fontStyle: 'italic',
    fontSize: 48,
    lineHeight: 54,
    color: colors.forest,
    letterSpacing: 0.4,
  },
  md: {
    marginTop: 8,
    fontSize: 32,
    lineHeight: 38,
  },
});
