import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ChoiceChip } from '@/components/ChoiceChip';
import { InterviewChrome } from '@/components/InterviewChrome';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Title } from '@/components/Title';
import { COPY } from '@/interview/copy';
import { useInterview } from '@/interview/context';
import { ENERGIES, SLACK_NIGHTS, type Energy, type SlackNight } from '@/interview/types';
import { colors, fonts } from '@/theme/colors';

const NONE: SlackNight = 'Honestly not many right now';

export default function TapsScreen() {
  const router = useRouter();
  const { state, setTaps, markStep } = useInterview();
  const [nights, setNights] = useState<SlackNight[]>(state.slackNights);
  const [energy, setEnergy] = useState<Energy | null>(state.energy);

  function toggleNight(night: SlackNight) {
    setNights((prev) => {
      if (night === NONE) return prev.includes(NONE) ? [] : [NONE];
      const withoutNone = prev.filter((n) => n !== NONE);
      return withoutNone.includes(night)
        ? withoutNone.filter((n) => n !== night)
        : [...withoutNone, night];
    });
  }

  return (
    <Screen
      footer={
        <PrimaryButton
          label={COPY.continue}
          disabled={!nights.length || !energy}
          onPress={() => {
            if (!energy) return;
            setTaps(nights, energy);
            router.push('/interview/examples');
          }}
        />
      }
    >
      <InterviewChrome
        step={1}
        total={6}
        startedAt={state.startedAt}
        onBack={() => {
          markStep('signup');
          router.back();
        }}
      />
      <Title>Taps</Title>
      <Text style={styles.label}>{COPY.slackLabel}</Text>
      <View style={styles.wrap}>
        {SLACK_NIGHTS.map((night) => (
          <ChoiceChip
            key={night}
            label={night}
            selected={nights.includes(night)}
            onPress={() => toggleNight(night)}
          />
        ))}
      </View>
      <Text style={styles.label}>{COPY.energyLabel}</Text>
      <View style={styles.wrap}>
        {ENERGIES.map((item) => (
          <ChoiceChip key={item} label={item} selected={energy === item} onPress={() => setEnergy(item)} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
