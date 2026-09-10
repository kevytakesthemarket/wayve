import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

const logo = require('../../assets/images/wayve-logo-script.png');

export function WayveMark({ size = 'lg' }: { size?: 'lg' | 'md' | 'header' }) {
  return (
    <Image
      source={logo}
      style={[styles.base, styles[size]]}
      contentFit="contain"
      accessibilityLabel="Wayve"
    />
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'center',
  },
  header: {
    width: 280,
    height: 72,
  },
  lg: {
    width: 280,
    height: 92,
    marginTop: 8,
  },
  md: {
    width: 200,
    height: 56,
    marginTop: 4,
  },
});
