import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { cardStyle, colors, fonts, formCardStyle } from '@/theme/colors';

export function Card({
  children,
  padded = true,
  variant = 'hero',
  title,
  style,
}: {
  children: ReactNode;
  padded?: boolean;
  variant?: 'hero' | 'form';
  title?: string;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        styles.base,
        variant === 'form' ? styles.form : styles.hero,
        padded && (variant === 'form' ? styles.formPad : styles.heroPad),
        style,
      ]}
    >
      {title ? (
        <>
          <Text style={variant === 'form' ? styles.formTitle : styles.heroTitle}>{title}</Text>
          {variant === 'form' ? <View style={styles.divider} /> : null}
        </>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    gap: 14,
  },
  hero: {
    ...cardStyle,
  },
  form: {
    ...formCardStyle,
  },
  heroPad: {
    padding: 24,
  },
  formPad: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
  },
  heroTitle: {
    fontFamily: fonts.serif,
    fontStyle: 'italic',
    fontWeight: '700',
    fontSize: 36,
    lineHeight: 42,
    color: colors.title,
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  formTitle: {
    fontFamily: fonts.sans,
    fontWeight: '600',
    fontSize: 28,
    lineHeight: 34,
    color: colors.body,
    textAlign: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginHorizontal: -24,
    marginBottom: 4,
  },
});
