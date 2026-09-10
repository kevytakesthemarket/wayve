import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/Card';
import { colors, fonts, titleStyle } from '@/theme/colors';

export function ExampleCard({ label, body }: { label: string; body: string }) {
  return (
    <Card>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.body}>{body}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  label: {
    ...titleStyle,
    fontSize: 16,
    lineHeight: 22,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: colors.body,
  },
});
