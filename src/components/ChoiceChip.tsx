import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts, radii } from '@/theme/colors';

export function ChoiceChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.selected]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.xl,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    cursor: 'pointer',
  },
  selected: {
    backgroundColor: colors.primaryFrom,
    borderColor: colors.accentStrong,
  },
  label: {
    color: colors.body,
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 20,
  },
  selectedLabel: {
    color: colors.body,
    fontWeight: '600',
  },
});
