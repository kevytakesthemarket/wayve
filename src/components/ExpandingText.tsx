import { StyleSheet, TextInput } from 'react-native';

import { colors, fonts } from '@/theme/colors';

export function ExpandingText({
  value,
  onChangeText,
  placeholder,
  compact,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  compact?: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.hint}
      multiline
      textAlignVertical="top"
      scrollEnabled
      autoCorrect
      autoCapitalize="sentences"
      style={[styles.input, compact && styles.compact]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 168,
    maxHeight: 320,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    fontFamily: fonts.sans,
    fontSize: 17,
    lineHeight: 24,
    color: colors.ink,
  },
  compact: {
    minHeight: 96,
    maxHeight: 180,
    borderRadius: 12,
  },
});
