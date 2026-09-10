import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii } from '@/theme/colors';

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
        styles.wrap,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressedScale,
      ]}
    >
      {({ pressed }) =>
        muted ? (
          <View style={[styles.btn, styles.mutedBtn, pressed && styles.mutedPressed]}>
            <Text style={styles.mutedLabel}>{label}</Text>
          </View>
        ) : (
          <LinearGradient
            colors={
              pressed && !disabled
                ? [colors.primaryFromPressed, colors.primaryToPressed]
                : [colors.primaryFrom, colors.primaryTo]
            }
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.btn}
          >
            <Text style={styles.label}>{label}</Text>
          </LinearGradient>
        )
      }
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    cursor: 'pointer',
  },
  btn: {
    borderRadius: radii.xl,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mutedBtn: {
    borderWidth: 1,
    borderColor: colors.secondaryBorder,
    backgroundColor: 'transparent',
  },
  mutedPressed: {
    borderColor: 'rgba(192, 132, 252, 0.5)',
  },
  disabled: {
    opacity: 0.4,
  },
  pressedScale: {
    transform: [{ scale: 0.99 }],
  },
  label: {
    color: colors.body,
    fontFamily: fonts.sans,
    fontSize: 16,
    fontWeight: '600',
  },
  mutedLabel: {
    color: colors.secondaryText,
    fontFamily: fonts.sans,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
