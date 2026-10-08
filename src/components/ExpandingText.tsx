import { StyleSheet, TextInput } from 'react-native';

import { colors, fonts } from '@/theme/colors';

export function ExpandingText({
  value,
  onChangeText,
  placeholder,
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
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 88,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
  },
});
