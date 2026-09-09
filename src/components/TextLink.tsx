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
    fontSize: 15,
    lineHeight: 22,
    color: colors.forest,
    fontWeight: '600',
  },
  muted: {
    color: colors.muted,
    fontWeight: '500',
  },
});
