import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, Platform, StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';

const dots = require('../../assets/images/halftone-dots.png');

/**
 * wayve.bio canvas: purple→blue wash with a repeating dotted halftone.
 * Chrome only — sits behind campus friends+clubs screens.
 */
export function HalftoneCanvas() {
  return (
    <View style={[StyleSheet.absoluteFill, styles.ignore]}>
      <LinearGradient
        colors={[colors.canvasFrom, colors.canvasTo]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {Platform.OS === 'web' ? (
        <View style={[StyleSheet.absoluteFill, styles.webDots]} />
      ) : (
        <ImageBackground
          source={dots}
          resizeMode="repeat"
          style={StyleSheet.absoluteFill}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ignore: {
    pointerEvents: 'none',
  },
  webDots: {
    backgroundImage:
      'radial-gradient(rgba(216, 180, 254, 0.42) 2.1px, transparent 2.25px)',
    backgroundSize: '14px 14px',
  } as Record<string, string>,
});
