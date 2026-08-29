import { Platform } from 'react-native';

/** Calm campus paper — not a nightclub, not a dating app. */
export const colors = {
  paper: '#F4EFE4',
  paperDeep: '#E8E0D0',
  card: '#FFFCF6',
  ink: '#1C2A22',
  muted: '#5C6B62',
  hint: '#7A877E',
  line: '#D4CBB8',
  forest: '#2F5D50',
  forestDeep: '#23463C',
  cream: '#FBF7EE',
  warning: '#6B5344',
  warningWash: '#F3E6D4',
  firstPass: '#8A5A2B',
} as const;

export const fonts = Platform.select({
  ios: {
    serif: 'Georgia',
    sans: 'System',
  },
  android: {
    serif: 'serif',
    sans: 'sans-serif',
  },
  default: {
    serif: 'Georgia',
    sans: 'system-ui',
  },
})!;
