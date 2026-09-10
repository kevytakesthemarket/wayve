import { Platform } from 'react-native';

/**
 * Dark campus canvas with Wayve purple accents.
 * Palette is borrowed from wayve.bio (purple on near-black) but the product
 * stays friends + clubs — not FreedomFest, not dating chrome.
 */
export const colors = {
  paper: '#0B0714',
  paperDeep: '#160C24',
  card: '#14101C',
  ink: '#F4EEFF',
  muted: '#B9ABC8',
  hint: '#8B7C9E',
  line: '#4A3470',
  forest: '#A78BFA',
  forestDeep: '#6D28D9',
  cream: '#F8F4FF',
  warning: '#E7B4A2',
  warningWash: '#2C1820',
  firstPass: '#D4BFFF',
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
