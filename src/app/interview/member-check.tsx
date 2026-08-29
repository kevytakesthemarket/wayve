import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { InterviewChrome } from '@/components/InterviewChrome';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { COPY } from '@/interview/copy';
import { useInterview } from '@/interview/context';
import { defaultPublicCard, scorer } from '@/scoring';
import { colors, fonts } from '@/theme/colors';

export default function MemberCheckScreen() {
  const router = useRouter();
  const { state, setSummary } = useInterview();
  const [editing, setEditing] = useState(false);
  const [bullets, setBullets] = useState(() =>
    state.summaryBullets.length ? state.summaryBullets : scorer.extractBullets(state),
  );
  const [selected, setSelected] = useState<number[]>(() => defaultSelected(state.summaryBullets));
  const [customCard, setCustomCard] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const school = state.signup.schoolName;
  const derivedCard = useMemo(() => {
    const picked = selected.map((i) => bullets[i]).filter(Boolean);
    return picked.join(' ') || defaultPublicCard(bullets);
  }, [bullets, selected]);

  const card = useCustom ? customCard : derivedCard;

  function updateBullet(index: number, value: string) {
    setBullets((prev) => prev.map((b, i) => (i === index ? value : b)));
  }

  function toggleSelect(index: number) {
    setSelected((prev) => {
      if (prev.includes(index)) return prev.filter((i) => i !== index);
      if (prev.length >= 2) return [prev[1], index];
      return [...prev, index];
    });
    setUseCustom(false);
  }

  function addBullet() {
    if (bullets.length >= 6) return;
    setEditing(true);
    setBullets((prev) => [...prev, '']);
  }

  return (
    <Screen
      extraBottom={32}
      footer={
        <PrimaryButton
          label="Approve this card"
          disabled={!card.trim()}
          onPress={() => {
            setSummary(
              bullets.filter((b) => b.trim()),
              card.trim(),
            );
            router.push('/interview/unlock');
          }}
        />
      }
    >
      <InterviewChrome step={6} total={6} startedAt={state.startedAt} onBack={() => router.back()} />
      <Text style={styles.q}>{COPY.memberHeader}</Text>

      <View style={styles.row}>
        <Pressable onPress={() => setEditing(false)} style={[styles.toggle, !editing && styles.toggleOn]}>
          <Text style={[styles.toggleText, !editing && styles.toggleTextOn]}>{COPY.looksRight}</Text>
        </Pressable>
        <Pressable onPress={() => setEditing(true)} style={[styles.toggle, editing && styles.toggleOn]}>
          <Text style={[styles.toggleText, editing && styles.toggleTextOn]}>{COPY.edit}</Text>
        </Pressable>
      </View>

      {bullets.map((bullet, index) => (
        <View key={index} style={styles.bulletRow}>
          <Text style={styles.dash}>•</Text>
          {editing ? (
            <TextInput
              value={bullet}
              onChangeText={(value) => updateBullet(index, value)}
              multiline
              style={styles.bulletInput}
            />
          ) : (
            <Text style={styles.bulletText}>{bullet}</Text>
          )}
        </View>
      ))}

      {editing && bullets.length < 6 ? (
        <Pressable onPress={addBullet}>
          <Text style={styles.link}>Add a line — your words only</Text>
        </Pressable>
      ) : null}

      <Text style={styles.privacy}>{COPY.memberPrivacy(school)}</Text>

      <Text style={styles.label}>{COPY.publicCardLabel}</Text>
      <Text style={styles.helper}>{COPY.publicCardHint}</Text>

      {bullets.map((bullet, index) =>
        bullet.trim() ? (
          <Pressable
            key={`pick-${index}`}
            onPress={() => toggleSelect(index)}
            style={[styles.pick, selected.includes(index) && !useCustom && styles.pickOn]}
          >
            <Text style={[styles.pickText, selected.includes(index) && !useCustom && styles.pickTextOn]}>
              {bullet}
            </Text>
          </Pressable>
        ) : null,
      )}

      <Pressable onPress={() => setUseCustom(true)}>
        <Text style={styles.link}>Or write your own 1–2 sentences</Text>
      </Pressable>
      {useCustom ? (
        <TextInput
          value={customCard}
          onChangeText={setCustomCard}
          multiline
          placeholder="Your words. We will not rewrite them."
          placeholderTextColor={colors.hint}
          style={styles.custom}
        />
      ) : (
        <View style={styles.preview}>
          <Text style={styles.previewLabel}>Card preview</Text>
          <Text style={styles.previewBody}>{card}</Text>
        </View>
      )}
    </Screen>
  );
}

function defaultSelected(bullets: string[]): number[] {
  const idxs: number[] = [];
  bullets.forEach((b, i) => {
    if (idxs.length >= 2) return;
    const tap = b.startsWith('Nights with slack') || b.startsWith('Default energy');
    if (!tap) idxs.push(i);
  });
  if (idxs.length === 0) return bullets.slice(0, 2).map((_, i) => i);
  return idxs;
}

const styles = StyleSheet.create({
  q: {
    fontFamily: fonts.serif,
    fontSize: 22,
    lineHeight: 30,
    color: colors.ink,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  toggle: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.card,
  },
  toggleOn: {
    backgroundColor: colors.forest,
    borderColor: colors.forest,
  },
  toggleText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
    fontWeight: '600',
  },
  toggleTextOn: {
    color: colors.cream,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  dash: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.forest,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 23,
    color: colors.ink,
  },
  bulletInput: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 23,
    color: colors.ink,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    padding: 10,
    minHeight: 48,
  },
  privacy: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    marginTop: 8,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 8,
  },
  helper: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  pick: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
  },
  pickOn: {
    borderColor: colors.forest,
    backgroundColor: colors.cream,
  },
  pickText: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 21,
    color: colors.ink,
  },
  pickTextOn: {
    color: colors.forestDeep,
  },
  link: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.forest,
    fontWeight: '600',
  },
  custom: {
    minHeight: 100,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 12,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
  },
  preview: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 6,
  },
  previewLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    color: colors.hint,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  previewBody: {
    fontFamily: fonts.serif,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
});
