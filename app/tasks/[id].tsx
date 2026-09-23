import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, RotateCcw } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { DetailSection, DetailShell, Field, NotFound } from '@/components/DetailShell';
import { Badge, Button, ListRow, Text } from '@/components/ui';
import { useHealthData } from '@/lib/data/store';
import { isOverdue, personById, providerById } from '@/lib/data/selectors';
import { formatWhen } from '@/lib/format';

export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, toggleTask } = useHealthData();
  const task = data.tasks.find((t) => t.id === id);
  if (!task) return <NotFound what="task" onBack={() => router.back()} />;

  const person = personById(data, task.personId);
  const provider = providerById(data, task.linkedProviderId);
  const appt = data.appointments.find((a) => a.id === task.linkedAppointmentId);
  const done = !!task.completedAt;
  const overdue = isOverdue(task);

  return (
    <DetailShell eyebrow={done ? 'Completed task' : overdue ? 'Overdue task' : 'Care task'} title={task.title} subtitle={task.description}>
      <View style={styles.row}>
        {done ? (
          <Button label="Mark as not done" icon={RotateCcw} variant="secondary" onPress={() => toggleTask(task.id)} />
        ) : (
          <Button label="Mark as done" icon={Check} onPress={() => toggleTask(task.id)} />
        )}
        <Badge label={`${task.priority} priority`} tone={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'neutral'} />
      </View>

      <DetailSection title="Details">
        <Field label="For" value={person?.name} />
        <Field label="Due" value={task.dueAt ? formatWhen(task.dueAt) : 'No due date'} />
        {done && <Field label="Completed" value={formatWhen(task.completedAt!)} />}
      </DetailSection>

      {(appt || provider) && (
        <DetailSection title="Linked to">
          {appt && (
            <ListRow title={appt.title} subtitle={formatWhen(appt.startsAt)} onPress={() => router.push({ pathname: '/appointments/[id]', params: { id: appt.id } })} />
          )}
          {provider && (
            <ListRow title={provider.name} subtitle={provider.organisation} onPress={() => router.push({ pathname: '/providers/[id]', params: { id: provider.id } })} />
          )}
        </DetailSection>
      )}

      {!task.description && !appt && !provider && (
        <Text variant="caption" tone="muted">
          Notes, links to visits and provider details can be attached to tasks as your care records grow.
        </Text>
      )}
    </DetailShell>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' } });
