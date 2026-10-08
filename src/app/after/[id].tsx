import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ChoiceChip } from '@/components/ChoiceChip';
import { ExpandingText } from '@/components/ExpandingText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { Title } from '@/components/Title';
import { PLAN_COPY } from '@/plan/copy';
import { usePlan } from '@/plan/context';
import { colors, fonts } from '@/theme/colors';

export default function AfterVisitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recordVisit, visitFor, findClub } = usePlan();
  const club = id ? findClub(id) : undefined;
  const existing = id ? visitFor(id) : undefined;
  const [stay, setStay] = useState<boolean | null>(existing?.stay_past_15 ?? null);
  const [ret, setRet] = useState<boolean | null>(existing?.return_14d ?? null);
  const [scene, setScene] = useState(existing?.sceneNote ?? '');

  if (!club) {
    return (
      <Screen>
        <TextLink label="Back" onPress={() => router.back()} />
        <Title>After</Title>
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <PrimaryButton
          label={PLAN_COPY.afterSave}
          disabled={stay === null || ret === null}
          onPress={() => {
            recordVisit({
              clubId: club.id,
              stay_past_15: stay,
              return_14d: ret,
              sceneNote: scene.trim(),
              completedAt: Date.now(),
            });
            router.replace('/home');
          }}
        />
      }
    >
      <TextLink label="Back" onPress={() => router.back()} />
      <Title>After</Title>
      <Text style={styles.meta}>{club.name}</Text>
      <Text style={styles.q}>{PLAN_COPY.stayQ}</Text>
      <View style={styles.wrap}>
        <ChoiceChip label="Yes" selected={stay === true} onPress={() => setStay(true)} />
        <ChoiceChip label="No" selected={stay === false} onPress={() => setStay(false)} />
      </View>
      <Text style={styles.q}>{PLAN_COPY.returnQ}</Text>
      <View style={styles.wrap}>
        <ChoiceChip label="Yes" selected={ret === true} onPress={() => setRet(true)} />
        <ChoiceChip label="No" selected={ret === false} onPress={() => setRet(false)} />
      </View>
      <ExpandingText value={scene} onChangeText={setScene} placeholder={PLAN_COPY.sceneQ} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
  q: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
