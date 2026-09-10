import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

import { titleStyle } from '@/theme/colors';

export function Heading({
  children,
  size = 'lg',
  align = 'left',
}: {
  children: ReactNode;
  size?: 'xl' | 'lg' | 'md';
  align?: 'left' | 'center';
}) {
  return (
    <Text
      accessibilityRole="header"
      style={[styles.base, styles[size], align === 'center' && styles.center]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    ...titleStyle,
  },
  xl: {
    fontSize: 36,
    lineHeight: 42,
  },
  lg: {
    fontSize: 30,
    lineHeight: 36,
  },
  md: {
    fontSize: 24,
    lineHeight: 32,
  },
  center: {
    textAlign: 'center',
  },
});
