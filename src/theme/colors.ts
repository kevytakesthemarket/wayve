import { Platform } from 'react-native';

/** Wireframe skeleton — no designed chrome. */
export const colors = {
  paper: '#F2F2F2',
  paperDeep: '#E6E6E6',
  card: '#FFFFFF',
  ink: '#111111',
  muted: '#666666',
  hint: '#888888',
  line: '#CCCCCC',
  forest: '#111111',
  forestDeep: '#111111',
  cream: '#FFFFFF',
  warning: '#8A3B2A',
  warningWash: '#F0E4E0',
  firstPass: '#666666',
} as const;

export const fonts = Platform.select({
  ios: {
    serif: 'System',
    sans: 'System',
  },
  android: {
    serif: 'sans-serif',
    sans: 'sans-serif',
  },
  default: {
    serif: 'system-ui',
    sans: 'system-ui',
  },
})!;
