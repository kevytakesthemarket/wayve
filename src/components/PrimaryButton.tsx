import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/theme/colors';

export function PrimaryButton({
  label,
  onPress,
  disabled,
  muted,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  muted?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, muted && styles.muted, disabled && styles.disabled]}
    >
      <Text style={[styles.label, muted && styles.mutedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.ink,
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  muted: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  disabled: {
    opacity: 0.35,
  },
  label: {
    color: colors.cream,
    fontFamily: fonts.sans,
    fontSize: 15,
    fontWeight: '600',
  },
  mutedLabel: {
    color: colors.ink,
  },
});
