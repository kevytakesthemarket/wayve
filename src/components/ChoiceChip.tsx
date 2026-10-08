import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/theme/colors';

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
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  selected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  label: {
    color: colors.ink,
    fontFamily: fonts.sans,
    fontSize: 14,
  },
  selectedLabel: {
    color: colors.cream,
  },
});
