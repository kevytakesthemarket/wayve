import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ChoiceChip } from '@/components/ChoiceChip';
import { ExpandingText } from '@/components/ExpandingText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { PLAN_COPY } from '@/plan/copy';
import { usePlan } from '@/plan/context';
import { colors, fonts } from '@/theme/colors';

export default function AfterVisitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recordVisit, visitFor, commitmentFor, findClub } = usePlan();
  const club = id ? findClub(id) : undefined;
  const existing = id ? visitFor(id) : undefined;
  const commitment = id ? commitmentFor(id) : undefined;

  const [stay, setStay] = useState<boolean | null>(existing?.stay_past_15 ?? null);
  const [ret, setRet] = useState<boolean | null>(existing?.return_14d ?? null);
  const [scene, setScene] = useState(existing?.sceneNote ?? '');

  if (!club) {
    return (
      <Screen>
        <TextLink label="Back" onPress={() => router.back()} />
        <Text style={styles.title}>That visit is not on your plan.</Text>
      </Screen>
    );
  }

  const canSave = stay !== null && ret !== null;

  return (
    <Screen
      extraBottom={32}
      footer={
        <PrimaryButton
          label={PLAN_COPY.afterSave}
          disabled={!canSave}
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
      <Text style={styles.title}>{club.name}</Text>
      <Text style={styles.lead}>{PLAN_COPY.afterLead}</Text>

      {commitment ? <Text style={styles.committed}>{commitment.nextAction}</Text> : null}

      <Text style={styles.q}>{PLAN_COPY.stayQ}</Text>
      <Text style={styles.tag}>stay_past_15</Text>
      <View style={styles.wrap}>
        <ChoiceChip label={PLAN_COPY.yes} selected={stay === true} onPress={() => setStay(true)} />
        <ChoiceChip label={PLAN_COPY.no} selected={stay === false} onPress={() => setStay(false)} />
      </View>

      <Text style={styles.q}>{PLAN_COPY.returnQ}</Text>
      <Text style={styles.tag}>return_14d</Text>
      <View style={styles.wrap}>
        <ChoiceChip label={PLAN_COPY.yes} selected={ret === true} onPress={() => setRet(true)} />
        <ChoiceChip label={PLAN_COPY.no} selected={ret === false} onPress={() => setRet(false)} />
      </View>

      <Text style={styles.q}>{PLAN_COPY.sceneQ}</Text>
      <Text style={styles.helper}>{PLAN_COPY.sceneHelper}</Text>
      <ExpandingText
        value={scene}
        onChangeText={setScene}
        placeholder="What was actually happening."
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
  lead: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
  },
  committed: {
    fontFamily: fonts.serif,
    fontSize: 18,
    lineHeight: 26,
    color: colors.ink,
  },
  q: {
    fontFamily: fonts.serif,
    fontSize: 22,
    lineHeight: 30,
    color: colors.ink,
    marginTop: 8,
  },
  tag: {
    fontFamily: fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: colors.hint,
  },
  helper: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
