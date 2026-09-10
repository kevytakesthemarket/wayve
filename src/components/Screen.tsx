import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HalftoneCanvas } from '@/components/HalftoneCanvas';
import { WayveMark } from '@/components/WayveMark';
import { colors } from '@/theme/colors';

export function Screen({
  children,
  footer,
  extraBottom = 24,
  centered = false,
}: {
  children: ReactNode;
  footer?: ReactNode;
  extraBottom?: number;
  centered?: boolean;
}) {
  return (
    <View style={styles.root}>
      <HalftoneCanvas />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <View style={styles.headerSide} />
          <View style={styles.headerCenter}>
            <WayveMark size="header" />
          </View>
          <View style={styles.headerSide} />
        </View>
        <View style={styles.headerRule} />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={[
              styles.content,
              centered && styles.centered,
              { paddingBottom: extraBottom },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
          {footer ? (
            <View style={styles.footerBar}>
              <View style={styles.footerRule} />
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
    height: 96,
    backgroundColor: colors.chrome,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerSide: {
    width: 56,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRule: {
    height: 2,
    width: '100%',
    backgroundColor: colors.chromeBorder,
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
    paddingTop: 24,
    gap: 16,
  },
  centered: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 48,
  },
  footerBar: {
    backgroundColor: colors.chrome,
  },
  footerRule: {
    height: 2,
    width: '100%',
    backgroundColor: colors.chromeBorder,
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
