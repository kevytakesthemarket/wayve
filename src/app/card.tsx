import { useRouter } from 'expo-router';
import { useState } from 'react';

import { ExpandingText } from '@/components/ExpandingText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { Title } from '@/components/Title';
import { useInterview } from '@/interview/context';
import { PLAN_COPY } from '@/plan/copy';

export default function PublicCardScreen() {
  const router = useRouter();
  const { state, updatePublicCard } = useInterview();
  const [card, setCard] = useState(state.publicCard);

  return (
    <Screen
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
      <Title>Card</Title>
      <ExpandingText value={card} onChangeText={setCard} placeholder={PLAN_COPY.cardHint} />
    </Screen>
  );
}
