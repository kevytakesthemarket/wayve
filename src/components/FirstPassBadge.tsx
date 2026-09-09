import { StyleSheet, Text } from 'react-native';

import { PLAN_COPY } from '@/plan/copy';
import { colors, fonts } from '@/theme/colors';

export function FirstPassBadge() {
  return <Text style={styles.kicker}>{PLAN_COPY.firstPass}</Text>;
}

const styles = StyleSheet.create({
  kicker: {
    alignSelf: 'flex-start',
    fontFamily: fonts.sans,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: colors.firstPass,
    borderWidth: 1,
    borderColor: colors.firstPass,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
