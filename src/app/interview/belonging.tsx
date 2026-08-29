import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { ExpandingText } from '@/components/ExpandingText';
import { InterviewChrome } from '@/components/InterviewChrome';
import { Notice } from '@/components/Notice';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useAnswerGate } from '@/hooks/useAnswerGate';
import { COPY } from '@/interview/copy';
import { useInterview } from '@/interview/context';
import { PROBE_BELONGING } from '@/scoring/cliches';
import { colors, fonts } from '@/theme/colors';

export default function BelongingScreen() {
  const router = useRouter();
  const { state, setBelonging } = useInterview();
  const [text, setText] = useState(state.belonging.text);
  const [photoUri, setPhotoUri] = useState<string | null>(state.belonging.photoUri ?? null);
  const [photoNote, setPhotoNote] = useState<string | null>(null);
  const { notice, submit } = useAnswerGate(PROBE_BELONGING);

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      if (!text.trim()) setPhotoNote(COPY.photoNeedCaption);
    }
  }

  return (
    <Screen
      footer={
        <PrimaryButton
          label={COPY.continue}
          disabled={!text.trim()}
          onPress={() => {
            if (photoUri && !text.trim()) {
              setPhotoNote(COPY.photoNeedCaption);
              return;
            }
            const answer = submit(text, photoUri);
            if (!answer) return;
            setBelonging(answer);
            router.push('/interview/thursday');
          }}
        />
      }
    >
      <InterviewChrome step={3} total={6} startedAt={state.startedAt} onBack={() => router.back()} />
      <Text style={styles.q}>{COPY.belongingQ}</Text>
      <Text style={styles.helper}>{COPY.belongingHelper}</Text>
      <ExpandingText
        value={text}
        onChangeText={(value) => {
          setText(value);
          if (value.trim()) setPhotoNote(null);
        }}
        placeholder="A night or afternoon. Where were you. What was happening."
      />
      <Pressable onPress={pickPhoto} accessibilityRole="button">
        <Text style={styles.photo}>{COPY.photoAlt}</Text>
      </Pressable>
      {photoUri ? (
        <View style={styles.previewWrap}>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          <Pressable onPress={() => setPhotoUri(null)}>
            <Text style={styles.remove}>Remove photo</Text>
          </Pressable>
        </View>
      ) : null}
      {photoNote ? <Notice text={photoNote} /> : null}
      {notice ? <Notice text={notice} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  q: {
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 32,
    color: colors.ink,
  },
  helper: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
  photo: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.forest,
    fontWeight: '600',
  },
  previewWrap: {
    gap: 8,
  },
  preview: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    backgroundColor: colors.paperDeep,
  },
  remove: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },
});
