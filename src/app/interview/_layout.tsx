import { Stack } from 'expo-router';

import { colors } from '@/theme/colors';

export default function InterviewLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.paper },
        animation: 'slide_from_right',
      }}
    />
  );
}
