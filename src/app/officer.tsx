import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { ChoiceChip } from '@/components/ChoiceChip';
import { ExpandingText } from '@/components/ExpandingText';
import { Field } from '@/components/Field';
import { Notice } from '@/components/Notice';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextLink } from '@/components/TextLink';
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
          <PrimaryButton label="Back to this week" onPress={() => router.replace('/home')} />
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
      <Text style={styles.lead}>{PLAN_COPY.officerLead}</Text>

      {listed ? <Notice text={PLAN_COPY.officerListed} /> : null}

      <Card variant="form" title="List a room">
        <Field
          label={PLAN_COPY.officerName}
          value={draft.name}
          onChangeText={(name) => setDraft((prev) => ({ ...prev, name }))}
          placeholder="South-wing Sculpture Studio"
        />

        <Text style={styles.label}>{PLAN_COPY.officerFirst15}</Text>
        <ExpandingText
          value={draft.first_15_script}
          onChangeText={(first_15_script) => setDraft((prev) => ({ ...prev, first_15_script }))}
          placeholder="Walk in. Put your bag down. Start the thing. The first 15 minutes is…"
        />

        <Text style={styles.label}>{PLAN_COPY.officerStay}</Text>
        <ExpandingText
          value={draft.stay_leave}
          onChangeText={(stay_leave) => setDraft((prev) => ({ ...prev, stay_leave }))}
          placeholder="Stay if… Leave if…"
        />

        <Field
          label={PLAN_COPY.officerHours}
          value={draft.weekly_hours}
          onChangeText={(weekly_hours) => setDraft((prev) => ({ ...prev, weekly_hours }))}
          placeholder="Thursdays 7–10pm, south-wing studio"
        />

        <Field
          label={PLAN_COPY.officerNext}
          value={draft.next_meeting}
          onChangeText={(next_meeting) => setDraft((prev) => ({ ...prev, next_meeting }))}
          placeholder="Thursday 7pm, south-wing studio"
        />

        <Text style={styles.label}>{PLAN_COPY.officerNotFit}</Text>
        <ExpandingText
          value={draft.not_fit_if}
          onChangeText={(not_fit_if) => setDraft((prev) => ({ ...prev, not_fit_if }))}
          placeholder="You need a mixer, a roster, or a pledge process."
        />

        <Field
          label={PLAN_COPY.officerWalk}
          value={draft.walk_instruction}
          onChangeText={(walk_instruction) => setDraft((prev) => ({ ...prev, walk_instruction }))}
          placeholder="walk to the south-wing studio at 7"
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
      </Card>

      {!listed && draft.first_15_script.trim() === '' && draft.name.trim() ? (
        <Notice text="This club will not appear on anyone's weekly plan until the first 15 minutes is written." />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
    marginTop: 8,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
