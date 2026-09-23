import { BellOff, CheckCheck } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

import { PageHeader } from '@/components/PageHeader';
import { PersonSwitcher } from '@/components/PersonSwitcher';
import { UpdateRow } from '@/components/UpdateRow';
import { Button, Card, EmptyState, Screen, SectionHeader } from '@/components/ui';
import { useHealthData } from '@/lib/data/store';
import { allUpdates, unreadUpdates } from '@/lib/data/selectors';

export default function UpdatesScreen() {
  const { data, selectedPersonId, markAllUpdatesRead } = useHealthData();
  const unread = unreadUpdates(data, selectedPersonId);
  const all = allUpdates(data, selectedPersonId);
  const read = all.filter((u) => !!u.readAt);

  return (
    <Screen>
      <PageHeader
        title="Updates"
        subtitle="Results, messages and alerts from your care team."
        action={unread.length > 0 ? <Button label="Mark all read" icon={CheckCheck} variant="secondary" size="sm" onPress={markAllUpdatesRead} /> : undefined}
      />
      <PersonSwitcher />

      {all.length === 0 ? (
        <Card>
          <EmptyState icon={BellOff} title="No updates yet" message="Lab results, provider messages and medication alerts will land here as they arrive." />
        </Card>
      ) : (
        <>
          <SectionHeader title="New" count={unread.length} />
          <Card padded={false} style={styles.listCard}>
            {unread.length === 0 ? (
              <EmptyState compact icon={CheckCheck} title="You're caught up" message="Everything has been read." />
            ) : (
              unread.map((u) => <UpdateRow key={u.id} update={u} />)
            )}
          </Card>
          {read.length > 0 && (
            <>
              <SectionHeader title="Earlier" count={read.length} />
              <Card padded={false} style={styles.listCard}>
                {read.map((u) => (
                  <UpdateRow key={u.id} update={u} />
                ))}
              </Card>
            </>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({ listCard: { paddingHorizontal: 12 } });
