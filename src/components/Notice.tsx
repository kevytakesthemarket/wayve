import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii } from '@/theme/colors';

export function Notice({ text }: { text: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.warningWash,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.secondaryBorder,
    padding: 14,
  },
  text: {
    color: colors.secondaryText,
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 21,
  },
});
