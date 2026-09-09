import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { ExpandingText } from '@/components/ExpandingText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { useInterview } from '@/interview/context';
import { PLAN_COPY } from '@/plan/copy';
import { colors, fonts } from '@/theme/colors';

export default function PublicCardScreen() {
  const router = useRouter();
  const { state, updatePublicCard } = useInterview();
  const [card, setCard] = useState(state.publicCard);

  return (
    <Screen
      extraBottom={32}
      footer={
        <PrimaryButton
          label={PLAN_COPY.cardSave}
          disabled={!card.trim()}
          onPress={() => {
            updatePublicCard(card);
            router.back();
          }}
        />
      }
    >
      <TextLink label="Back" onPress={() => router.back()} />
      <Text style={styles.title}>{PLAN_COPY.cardTitle}</Text>
      <Text style={styles.privacy}>{PLAN_COPY.cardPrivacy}</Text>
      <Text style={styles.hint}>{PLAN_COPY.cardHint}</Text>
      <ExpandingText
        value={card}
        onChangeText={setCard}
        placeholder="Your words. We will not rewrite them."
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 34,
    color: colors.ink,
  },
  privacy: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: colors.forest,
  },
  hint: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
});
