import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { ChoiceChip } from '@/components/ChoiceChip';
import { ExpandingText } from '@/components/ExpandingText';
import { Notice } from '@/components/Notice';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
import { Title } from '@/components/Title';
import { PLAN_COPY } from '@/plan/copy';
import { usePlan } from '@/plan/context';
import { draftToClub, INTAKE_NIGHTS, intakeErrors, type ClubDraft } from '@/plan/intake';
import { colors, fonts } from '@/theme/colors';

const emptyDraft = (): ClubDraft => ({
  name: '',
  first_15_script: '',
  stay_leave: '',
  weekly_hours: '',
  next_meeting: '',
  not_fit_if: '',
  drop_in_ok: false,
  walk_instruction: '',
  slack_nights: [],
});

export default function OfficerIntakeScreen() {
  const router = useRouter();
  const { addOfficerClub } = usePlan();
  const [draft, setDraft] = useState<ClubDraft>(emptyDraft);
  const [listed, setListed] = useState(false);
  const errors = useMemo(() => intakeErrors(draft), [draft]);

  function toggleNight(night: string) {
    setDraft((prev) => {
      const has = prev.slack_nights.includes(night);
      return {
        ...prev,
        slack_nights: has ? prev.slack_nights.filter((item) => item !== night) : [...prev.slack_nights, night],
      };
    });
  }

  return (
    <Screen
      extraBottom={32}
      footer={
        listed ? (
          <PrimaryButton label="Home" onPress={() => router.replace('/home')} />
        ) : (
          <PrimaryButton
            label={PLAN_COPY.officerSubmit}
            disabled={errors.length > 0}
            onPress={() => {
              const club = draftToClub(draft);
              if (!club) return;
              const result = addOfficerClub(club);
              if (result === 'listed') setListed(true);
            }}
          />
        )
      }
    >
      <TextLink label="Back" onPress={() => router.back()} />
      <Title>Officer</Title>

      {listed ? <Notice text={PLAN_COPY.officerListed} /> : null}

      <Text style={styles.label}>{PLAN_COPY.officerName}</Text>
      <TextInput
        value={draft.name}
        onChangeText={(name) => setDraft((prev) => ({ ...prev, name }))}
        placeholder="Name"
        placeholderTextColor={colors.hint}
        style={styles.field}
      />

      <Text style={styles.label}>{PLAN_COPY.officerFirst15}</Text>
      <ExpandingText
        value={draft.first_15_script}
        onChangeText={(first_15_script) => setDraft((prev) => ({ ...prev, first_15_script }))}
        placeholder="First 15 minutes"
      />

      <Text style={styles.label}>{PLAN_COPY.officerStay}</Text>
      <ExpandingText
        value={draft.stay_leave}
        onChangeText={(stay_leave) => setDraft((prev) => ({ ...prev, stay_leave }))}
        placeholder="Stay / leave"
      />

      <Text style={styles.label}>{PLAN_COPY.officerHours}</Text>
      <TextInput
        value={draft.weekly_hours}
        onChangeText={(weekly_hours) => setDraft((prev) => ({ ...prev, weekly_hours }))}
        placeholder="Hours"
        placeholderTextColor={colors.hint}
        style={styles.field}
      />

      <Text style={styles.label}>{PLAN_COPY.officerNext}</Text>
      <TextInput
        value={draft.next_meeting}
        onChangeText={(next_meeting) => setDraft((prev) => ({ ...prev, next_meeting }))}
        placeholder="Next meeting"
        placeholderTextColor={colors.hint}
        style={styles.field}
      />

      <Text style={styles.label}>{PLAN_COPY.officerNotFit}</Text>
      <ExpandingText
        value={draft.not_fit_if}
        onChangeText={(not_fit_if) => setDraft((prev) => ({ ...prev, not_fit_if }))}
        placeholder="Not a fit if"
      />

      <Text style={styles.label}>{PLAN_COPY.officerWalk}</Text>
      <TextInput
        value={draft.walk_instruction}
        onChangeText={(walk_instruction) => setDraft((prev) => ({ ...prev, walk_instruction }))}
        placeholder="Walk instruction"
        placeholderTextColor={colors.hint}
        style={styles.field}
      />

      <Text style={styles.label}>{PLAN_COPY.officerNights}</Text>
      <View style={styles.wrap}>
        {INTAKE_NIGHTS.map((night) => (
          <ChoiceChip
            key={night}
            label={night}
            selected={draft.slack_nights.includes(night)}
            onPress={() => toggleNight(night)}
          />
        ))}
      </View>

      <ChoiceChip
        label={PLAN_COPY.officerDropIn}
        selected={draft.drop_in_ok}
        onPress={() => setDraft((prev) => ({ ...prev, drop_in_ok: !prev.drop_in_ok }))}
      />

      {!listed && draft.first_15_script.trim() === '' && draft.name.trim() ? (
        <Notice text="Needs first 15 minutes to list." />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },
  field: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
