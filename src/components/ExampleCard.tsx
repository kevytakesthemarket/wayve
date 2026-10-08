import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme/colors';

export function ExampleCard({ label }: { label: string; body?: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    padding: 12,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
  },
});
