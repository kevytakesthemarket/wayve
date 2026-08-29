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
      style={({ pressed }) => [
        styles.btn,
        muted && styles.muted,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[styles.label, muted && styles.mutedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.forest,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
    cursor: 'pointer',
  },
  muted: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    backgroundColor: colors.forestDeep,
  },
  label: {
    color: colors.cream,
    fontFamily: fonts.sans,
    fontSize: 16,
    fontWeight: '600',
  },
  mutedLabel: {
    color: colors.ink,
  },
});
