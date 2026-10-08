import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme/colors';

export function Notice({ text }: { text: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.paperDeep,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    padding: 12,
  },
  text: {
    color: colors.ink,
    fontFamily: fonts.sans,
    fontSize: 14,
  },
});
