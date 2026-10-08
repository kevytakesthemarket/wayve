import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/theme/colors';

export function TextLink({
  label,
  onPress,
  muted,
}: {
  label: string;
  onPress: () => void;
  muted?: boolean;
}) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={6}>
      <Text style={[styles.link, muted && styles.muted]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
  },
  muted: {
    color: colors.muted,
  },
});
