import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { DetailSection, DetailShell, Field, NotFound } from '@/components/DetailShell';
import { ListRow, Text } from '@/components/ui';
import { Colors } from '@/constants/colors';
import { useHealthData } from '@/lib/data/store';
import { personById, providerById } from '@/lib/data/selectors';
import { formatDate, formatRelativeDays } from '@/lib/format';

export default function CarePlanDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, toggleCarePlanStep } = useHealthData();
  const plan = data.carePlans.find((c) => c.id === id);
  if (!plan) return <NotFound what="care plan" onBack={() => router.back()} />;

  const person = personById(data, plan.personId);
  const provider = providerById(data, plan.providerId);
  const done = plan.steps.filter((s) => s.done).length;
  const pct = Math.round((done / plan.steps.length) * 100);

  return (
    <DetailShell eyebrow="Care plan" title={plan.title} subtitle={plan.goal}>
      <View style={styles.progressWrap}>
        <View style={styles.progressHead}>
          <Text variant="subheading">
            {done} of {plan.steps.length} steps
          </Text>
          <Text variant="caption" tone="muted">
            {pct}%
          </Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct}%` }]} />
        </View>
      </View>

      <DetailSection title="Steps">
        {plan.steps.map((s) => (
          <Pressable key={s.id} onPress={() => toggleCarePlanStep(plan.id, s.id)} accessibilityRole="checkbox" accessibilityState={{ checked: s.done }} style={styles.step}>
            <View style={[styles.check, s.done && styles.checkDone]}>{s.done && <Check size={14} color={Colors.onPrimary} strokeWidth={3} />}</View>
            <Text style={[styles.stepLabel, s.done && styles.stepDone]}>{s.label}</Text>
          </Pressable>
        ))}
      </DetailSection>

      <DetailSection title="Details">
        <Field label="For" value={person?.name} />
        <Field label="Started" value={formatDate(plan.startedAt, { day: 'numeric', month: 'long', year: 'numeric' })} />
        <Field label="Next review" value={plan.reviewAt ? `${formatDate(plan.reviewAt, { day: 'numeric', month: 'long' })} (${formatRelativeDays(plan.reviewAt)})` : undefined} />
        {provider && <ListRow title={provider.name} subtitle={provider.specialty} onPress={() => router.push({ pathname: '/providers/[id]', params: { id: provider.id } })} />}
      </DetailSection>
    </DetailShell>
  );
}

const styles = StyleSheet.create({
  progressWrap: { gap: 8 },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between' },
  track: { height: 8, borderRadius: 4, backgroundColor: Colors.seafoamTint, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, minHeight: 44 },
  check: { width: 24, height: 24, borderRadius: 8, borderWidth: 2, borderColor: Colors.secondary, alignItems: 'center', justifyContent: 'center' },
  checkDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepLabel: { flex: 1 },
  stepDone: { color: Colors.light.textSecondary, textDecorationLine: 'line-through' },
});
