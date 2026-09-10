import { Platform, type TextStyle, type ViewStyle } from 'react-native';

/**
 * Visual tokens copied from wayve.bio (Next.js / Tailwind, dark theme).
 * Product copy and flows stay campus friends + clubs — this file is chrome only.
 *
 * Live reference:
 * - canvas: bg-gradient-to-b from-purple-900 to-blue-950
 * - chrome: bg-zinc-900 + border-purple-500
 * - hero: bg-black border-2 border-purple-500 rounded-2xl
 * - titles: Georgia italic bold text-purple-400
 * - primary CTA: bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl
 */
export const colors = {
  canvasFrom: '#581c87', // purple-900
  canvasTo: '#172554', // blue-950
  chrome: '#18181b', // zinc-900
  chromeBorder: '#a855f7', // purple-500
  surface: '#000000',
  surfaceMuted: '#27272a', // zinc-800
  inputBg: '#27272a',
  inputBorder: '#3f3f46', // zinc-700
  divider: '#27272a',
  title: '#c084fc', // purple-400
  body: '#ffffff',
  muted: '#d4d4d8', // zinc-300
  hint: '#a1a1aa', // zinc-400
  placeholder: '#71717a', // zinc-500
  primaryFrom: '#9333ea', // purple-600
  primaryTo: '#2563eb', // blue-600
  primaryFromPressed: '#7e22ce', // purple-700
  primaryToPressed: '#1d4ed8', // blue-700
  secondaryBorder: 'rgba(192, 132, 252, 0.3)', // purple-400/30
  secondaryText: '#e9d5ff', // purple-200
  link: '#d8b4fe', // purple-300
  accent: '#c084fc',
  accentStrong: '#a855f7',
  warning: '#f0abfc',
  warningWash: 'rgba(168, 85, 247, 0.16)',
  firstPass: '#c084fc',

  // Existing screen aliases — mapped onto the wayve.bio palette so
  // leftover local styles still land on the same chrome.
  paper: '#172554',
  paperDeep: '#581c87',
  card: '#000000',
  ink: '#ffffff',
  line: '#3f3f46',
  forest: '#c084fc',
  forestDeep: '#9333ea',
  cream: '#ffffff',
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

export const radii = {
  xl: 12,
  '2xl': 16,
  '3xl': 24,
} as const;

export const titleStyle: TextStyle = {
  fontFamily: fonts.serif,
  fontStyle: 'italic',
  fontWeight: '700',
  color: colors.title,
  letterSpacing: 0.4,
};

export const bodyStyle: TextStyle = {
  fontFamily: fonts.sans,
  color: colors.body,
};

export const mutedStyle: TextStyle = {
  fontFamily: fonts.sans,
  color: colors.muted,
};

export const inputStyle: TextStyle = {
  backgroundColor: colors.inputBg,
  borderWidth: 1,
  borderColor: colors.inputBorder,
  borderRadius: radii.xl,
  paddingHorizontal: 16,
  paddingVertical: 12,
  minHeight: 44,
  fontFamily: fonts.sans,
  fontSize: 16,
  color: colors.body,
};

/** Welcome / club cards: black + 2px purple-500, rounded-2xl */
export const cardStyle: ViewStyle = {
  backgroundColor: colors.surface,
  borderRadius: radii['2xl'],
  ...Platform.select({
    web: {
      boxShadow: `0 0 0 2px ${colors.chromeBorder}`,
    },
    default: {
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: colors.chromeBorder,
    },
  }),
};

/** Sign-in / sign-up cards: floating black, no purple ring, rounded-3xl */
export const formCardStyle: ViewStyle = {
  backgroundColor: colors.surface,
  borderRadius: radii['3xl'],
  ...Platform.select({
    web: {
      boxShadow: '0 18px 40px rgba(0, 0, 0, 0.45)',
    },
    default: {
      shadowColor: '#000',
      shadowOpacity: 0.4,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },
  }),
};
