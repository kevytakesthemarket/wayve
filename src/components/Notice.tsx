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
    backgroundColor: colors.warningWash,
    borderRadius: 12,
    padding: 14,
  },
  text: {
    color: colors.warning,
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 21,
  },
});
