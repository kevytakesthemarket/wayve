import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/theme/colors';

export function ExampleCard({ label, body }: { label: string; body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable
      onPress={() => setOpen((prev) => !prev)}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      style={styles.card}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.body} numberOfLines={open ? undefined : 2}>
        {body}
      </Text>
      <Text style={styles.more}>{open ? 'Less' : 'More'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 6,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: colors.forest,
    letterSpacing: 0.2,
  },
  body: {
    fontFamily: fonts.serif,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
  more: {
    fontFamily: fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
});
