import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WayveMark } from '@/components/WayveMark';
import { colors } from '@/theme/colors';

export function Screen({
  children,
  footer,
  extraBottom = 24,
}: {
  children: ReactNode;
  footer?: ReactNode;
  extraBottom?: number;
}) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.canvasFrom, colors.canvasTo]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <WayveMark size="header" />
        </View>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: extraBottom }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
          {footer ? (
            <View style={styles.footerBar}>
              <View style={styles.footerInner}>{footer}</View>
            </View>
          ) : null}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvasTo,
  },
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    height: 80,
    backgroundColor: colors.chrome,
    borderBottomWidth: 2,
    borderBottomColor: colors.chromeBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.chromeBorder,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  flex: {
    flex: 1,
    width: '100%',
  },
  content: {
    width: '100%',
    maxWidth: 448,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 16,
  },
  footerBar: {
    backgroundColor: colors.chrome,
    borderTopWidth: 2,
    borderTopColor: colors.chromeBorder,
    shadowColor: colors.chromeBorder,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
  },
  footerInner: {
    width: '100%',
    maxWidth: 448,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 12 : 16,
    paddingTop: 12,
  },
});
