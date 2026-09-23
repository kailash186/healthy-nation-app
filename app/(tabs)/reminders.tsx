import { Bell, Pill } from 'lucide-react-native';
import { StyleSheet, Switch, View } from 'react-native';

import { PageHeader } from '@/components/PageHeader';
import { PersonSwitcher } from '@/components/PersonSwitcher';
import { PersonTag } from '@/components/PersonTag';
import { Badge, Card, EmptyState, ListRow, Screen, Text } from '@/components/ui';
import { Colors } from '@/constants/colors';
import { useHealthData } from '@/lib/data/store';
import { byPerson } from '@/lib/data/selectors';
import { formatTimeOfDay } from '@/lib/format';

const CADENCE = { once: 'Once', daily: 'Every day', weekly: 'Weekly', monthly: 'Monthly' } as const;
const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function RemindersScreen() {
  const { data, selectedPersonId, toggleReminder } = useHealthData();
  const reminders = byPerson(data.reminders, selectedPersonId).sort((a, b) => a.timeOfDay.localeCompare(b.timeOfDay));

  return (
    <Screen>
      <PageHeader title="Reminders" subtitle="Medications and check-ins. Turn any of them off temporarily." />
      <PersonSwitcher />
      <Card padded={false} style={styles.listCard}>
        {reminders.length === 0 ? (
          <EmptyState icon={Bell} title="No reminders set" message="Medication schedules and daily check-ins will be listed here once added." />
        ) : (
          reminders.map((r) => (
            <ListRow
              key={r.id}
              title={r.medication ? `${r.medication.name} · ${r.medication.dose}` : r.title}
              subtitle={`${formatTimeOfDay(r.timeOfDay)} · ${CADENCE[r.cadence]}${r.cadence === 'weekly' && r.daysOfWeek ? ` (${r.daysOfWeek.map((d) => DOW[d]).join(' ')})` : ''}`}
              leading={
                <View style={[styles.icon, !r.enabled && styles.iconOff]}>
                  {r.medication ? <Pill size={18} color={Colors.primary} /> : <Bell size={18} color={Colors.primary} />}
                </View>
              }
              trailing={
                <View style={styles.trailing}>
                  <PersonTag personId={r.personId} />
                  <Switch
                    value={r.enabled}
                    onValueChange={() => toggleReminder(r.id)}
                    trackColor={{ true: Colors.primary, false: Colors.light.border }}
                    thumbColor={Colors.surface}
                    accessibilityLabel={`${r.enabled ? 'Disable' : 'Enable'} reminder ${r.title}`}
                  />
                </View>
              }
              chevron={false}
            />
          ))
        )}
      </Card>
      {reminders.some((r) => !r.enabled) && (
        <View style={styles.note}>
          <Badge label="Paused" tone="neutral" />
          <Text variant="caption" tone="muted">
            Paused reminders won’t appear on the dashboard.
          </Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  listCard: { paddingHorizontal: 12 },
  icon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.seafoamTint, alignItems: 'center', justifyContent: 'center' },
  iconOff: { opacity: 0.4 },
  trailing: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  note: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
});
