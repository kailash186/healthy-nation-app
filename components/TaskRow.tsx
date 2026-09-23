import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { useHealthData } from '@/lib/data/store';
import { isOverdue } from '@/lib/data/selectors';
import type { CareTask } from '@/lib/data/types';
import { formatWhen } from '@/lib/format';

import { PersonTag } from './PersonTag';
import { Badge, ListRow, Text } from './ui';

export function TaskRow({ task }: { task: CareTask }) {
  const router = useRouter();
  const { toggleTask } = useHealthData();
  const done = !!task.completedAt;
  const overdue = isOverdue(task);

  return (
    <ListRow
      title={task.title}
      muted={done}
      onPress={() => router.push({ pathname: '/tasks/[id]', params: { id: task.id } })}
      leading={
        <Pressable
          onPress={() => toggleTask(task.id)}
          hitSlop={10}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={done ? 'Mark as not done' : 'Mark as done'}
          style={[styles.check, done && styles.checkDone]}
        >
          {done && <Check size={14} color={Colors.onPrimary} strokeWidth={3} />}
        </Pressable>
      }
      trailing={
        <View style={styles.trailing}>
          {!done && task.dueAt && (
            <Text variant="caption" tone={overdue ? 'danger' : 'muted'} style={overdue && styles.bold}>
              {overdue ? 'Overdue' : formatWhen(task.dueAt)}
            </Text>
          )}
          {!done && task.priority === 'high' && <Badge label="High" tone="danger" />}
          <PersonTag personId={task.personId} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  check: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  checkDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  trailing: { alignItems: 'flex-end', gap: 4 },
  bold: { fontFamily: 'InstrumentSans-Bold' },
});
