import { StyleSheet, TextInput } from 'react-native';

import { colors, inputStyle } from '@/theme/colors';

export function ExpandingText({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.placeholder}
      multiline
      textAlignVertical="top"
      scrollEnabled
      autoCorrect
      autoCapitalize="sentences"
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    ...inputStyle,
    minHeight: 168,
    maxHeight: 320,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: 17,
    lineHeight: 24,
  },
});
