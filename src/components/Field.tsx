import { StyleSheet, Text, TextInput, type TextInputProps } from 'react-native';

import { colors, fonts, inputStyle } from '@/theme/colors';

export function Field({
  label,
  ...props
}: TextInputProps & {
  label?: string;
}) {
  return (
    <>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.placeholder}
        {...props}
        style={[inputStyle, props.multiline && styles.multiline, props.style]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
    marginTop: 8,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
