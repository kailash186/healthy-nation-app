import { useRouter } from 'expo-router';
import { CheckCircle2, ClipboardList, Plus } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

import { PageHeader } from '@/components/PageHeader';
import { PersonSwitcher } from '@/components/PersonSwitcher';
import { TaskRow } from '@/components/TaskRow';
import { Button, Card, EmptyState, Screen, SectionHeader, useBreakpoint } from '@/components/ui';
import { useHealthData } from '@/lib/data/store';
import { completedTasks, isOverdue, openTasks } from '@/lib/data/selectors';

export default function TasksScreen() {
  const router = useRouter();
  const { data, selectedPersonId } = useHealthData();
  const { isMobile } = useBreakpoint();
  const open = openTasks(data, selectedPersonId);
  const done = completedTasks(data, selectedPersonId);
  const overdue = open.filter((t) => isOverdue(t));
  const rest = open.filter((t) => !isOverdue(t));

  const addButton = <Button label={isMobile ? 'Add' : 'Add task'} icon={Plus} size={isMobile ? 'sm' : 'md'} onPress={() => router.push('/tasks/new')} />;

  return (
    <Screen>
      <PageHeader title="Care tasks" subtitle="Things to do for yourself and the people you care for." action={addButton} />
      <PersonSwitcher />

      {open.length === 0 ? (
        <Card>
          <EmptyState
            icon={CheckCircle2}
            title="All clear"
            message="You have no open care tasks. Add one to keep track of refills, forms, calls or prep for a visit."
            actionLabel="Add a task"
            onAction={() => router.push('/tasks/new')}
          />
        </Card>
      ) : (
        <>
          {overdue.length > 0 && (
            <>
              <SectionHeader title="Overdue" count={overdue.length} />
              <Card padded={false} style={styles.listCard} tone="danger">
                {overdue.map((t) => (
                  <TaskRow key={t.id} task={t} />
                ))}
              </Card>
            </>
          )}
          <SectionHeader title={overdue.length > 0 ? 'Up next' : 'Open'} count={rest.length} />
          <Card padded={false} style={styles.listCard}>
            {rest.length === 0 ? (
              <EmptyState compact icon={ClipboardList} title="Nothing else pending" message="Clear the overdue items above and you're done." />
            ) : (
              rest.map((t) => <TaskRow key={t.id} task={t} />)
            )}
          </Card>
        </>
      )}

      {done.length > 0 && (
        <>
          <SectionHeader title="Completed" count={done.length} />
          <Card padded={false} style={styles.listCard}>
            {done.slice(0, 10).map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({ listCard: { paddingHorizontal: 12 } });
