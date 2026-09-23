import { useRouter } from 'expo-router';
import { Activity, Bell, CalendarDays, CheckCircle2, ClipboardList, Plus } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppointmentCard } from '@/components/AppointmentCard';
import { AttentionList } from '@/components/AttentionList';
import { PersonSwitcher } from '@/components/PersonSwitcher';
import { PersonTag } from '@/components/PersonTag';
import { TaskRow } from '@/components/TaskRow';
import { UpdateRow } from '@/components/UpdateRow';
import { Badge, Button, Card, EmptyState, Screen, SectionHeader, Text, useBreakpoint } from '@/components/ui';
import { Colors } from '@/constants/colors';
import { useHealthData } from '@/lib/data/store';
import {
  latestVitals,
  needsAttention,
  openTasks,
  todaysReminders,
  unreadUpdates,
  upcomingAppointments,
} from '@/lib/data/selectors';
import { formatTimeOfDay, greeting, VITAL_LABEL } from '@/lib/format';

export default function DashboardScreen() {
  const router = useRouter();
  const { data, selectedPersonId, acknowledgeReminder } = useHealthData();
  const { isMobile, isDesktop } = useBreakpoint();

  const me = data.people.find((p) => p.relationship === 'self');
  const attention = needsAttention(data, selectedPersonId);
  const appointments = upcomingAppointments(data, selectedPersonId);
  const tasks = openTasks(data, selectedPersonId);
  const updates = unreadUpdates(data, selectedPersonId);
  const reminders = todaysReminders(data, selectedPersonId);
  const vitals = latestVitals(data, selectedPersonId).slice(0, isDesktop ? 4 : 3);

  const remaining = reminders.filter((r) => !r.done).length;

  return (
    <Screen>
      {/* Greeting */}
      <View style={styles.greeting}>
        <View style={{ flex: 1 }}>
          <Text variant={isMobile ? 'title' : 'display'}>
            {greeting()}, {me?.name.split(' ')[0] ?? 'there'}
          </Text>
          <Text tone="muted">
            {attention.length === 0
              ? 'Everything is on track today.'
              : `${attention.length} ${attention.length === 1 ? 'thing needs' : 'things need'} your attention.`}
          </Text>
        </View>
        {!isMobile && <Button label="Add task" icon={Plus} onPress={() => router.push('/tasks/new')} />}
      </View>

      <PersonSwitcher />

      {/* Two-column on desktop: attention + next appointment | today's reminders + vitals */}
      <View style={[styles.columns, isDesktop && styles.columnsDesktop]}>
        <View style={styles.mainCol}>
          <SectionHeader title="Needs attention" count={attention.length} />
          <AttentionList items={attention} limit={5} />

          <SectionHeader title="Next appointment" href="/appointments" />
          {appointments[0] ? (
            <AppointmentCard appointment={appointments[0]} featured />
          ) : (
            <Card>
              <EmptyState
                compact
                icon={CalendarDays}
                title="No upcoming appointments"
                message="When a visit is booked it will appear here with prep notes and directions."
              />
            </Card>
          )}

          <SectionHeader title="Open tasks" count={tasks.length} href="/tasks" />
          <Card padded={false} style={styles.listCard}>
            {tasks.length === 0 ? (
              <EmptyState compact icon={CheckCircle2} title="No open tasks" message="Nice work — nothing is waiting on you." />
            ) : (
              tasks.slice(0, 4).map((t) => <TaskRow key={t.id} task={t} />)
            )}
          </Card>
        </View>

        <View style={styles.sideCol}>
          <SectionHeader title="Today's reminders" count={remaining} href="/reminders" linkLabel="Manage" />
          <Card padded={false} style={styles.listCard}>
            {reminders.length === 0 ? (
              <EmptyState compact icon={Bell} title="No reminders today" message="Medication and check-in reminders will be listed here." />
            ) : (
              reminders.map(({ reminder, done }) => (
                <View key={reminder.id} style={styles.reminderRow}>
                  <View style={styles.reminderTime}>
                    <Text variant="caption" tone="muted">
                      {formatTimeOfDay(reminder.timeOfDay)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="subheading" style={done && styles.done}>
                      {reminder.medication ? `${reminder.medication.name} ${reminder.medication.dose}` : reminder.title}
                    </Text>
                    <PersonTag personId={reminder.personId} />
                  </View>
                  {done ? (
                    <Badge label="Done" tone="success" />
                  ) : (
                    <Button label="Done" size="sm" variant="secondary" onPress={() => acknowledgeReminder(reminder.id)} />
                  )}
                </View>
              ))
            )}
          </Card>

          <SectionHeader title="Latest vitals" href="/care" linkLabel="Records" />
          {vitals.length === 0 ? (
            <Card>
              <EmptyState compact icon={Activity} title="No readings yet" message="Connect a device or log a reading to see trends here." />
            </Card>
          ) : (
            <View style={styles.vitalsGrid}>
              {vitals.map((v) => (
                <Card key={v.id} style={styles.vitalCard} onPress={() => router.push({ pathname: '/people/[id]', params: { id: v.personId } })}>
                  <View style={styles.vitalHead}>
                    <Text variant="caption" tone="muted">
                      {VITAL_LABEL[v.kind]}
                    </Text>
                    {v.status !== 'normal' && <Badge label={v.status === 'watch' ? 'Watch' : 'Alert'} tone={v.status === 'watch' ? 'warning' : 'danger'} />}
                  </View>
                  <Text variant="title">
                    {v.value}
                    <Text variant="caption" tone="muted">
                      {' '}
                      {v.unit}
                    </Text>
                  </Text>
                  <PersonTag personId={v.personId} />
                </Card>
              ))}
            </View>
          )}

          <SectionHeader title="Recent updates" count={updates.length} href="/updates" />
          <Card padded={false} style={styles.listCard}>
            {updates.length === 0 ? (
              <EmptyState compact icon={ClipboardList} title="You're up to date" message="New results and messages will show here." />
            ) : (
              updates.slice(0, 3).map((u) => <UpdateRow key={u.id} update={u} />)
            )}
          </Card>
        </View>
      </View>

      {isMobile && (
        <Button label="Add a care task" icon={Plus} onPress={() => router.push('/tasks/new')} style={styles.mobileCta} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 },
  columns: { gap: 8 },
  columnsDesktop: { flexDirection: 'row', gap: 32, alignItems: 'flex-start' },
  mainCol: { flex: 3, gap: 8 },
  sideCol: { flex: 2, gap: 8 },
  listCard: { paddingHorizontal: 12 },
  reminderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, minHeight: 56 },
  reminderTime: { width: 64 },
  done: { color: Colors.light.textSecondary, textDecorationLine: 'line-through' },
  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  vitalCard: { flexGrow: 1, flexBasis: 140, gap: 4 },
  vitalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 6 },
  mobileCta: { marginTop: 24 },
});
