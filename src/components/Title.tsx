import { StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/theme/colors';

export function Title({ children }: { children: string }) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.sans,
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
  },
});
