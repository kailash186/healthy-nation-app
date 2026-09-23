import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';
import type { HealthUpdate } from '@/lib/data/types';
import { formatRelativeDays } from '@/lib/format';

import { PersonTag } from './PersonTag';
import { ListRow, Text } from './ui';

const DOT = { urgent: Colors.status.error, attention: '#d9a441', info: Colors.primary } as const;

export function UpdateRow({ update }: { update: HealthUpdate }) {
  const router = useRouter();
  const unread = !update.readAt;
  return (
    <ListRow
      title={update.title}
      subtitle={`${update.source ?? 'Update'} · ${formatRelativeDays(update.createdAt)}`}
      onPress={() => router.push({ pathname: '/updates/[id]', params: { id: update.id } })}
      leading={
        <View style={styles.dotWrap}>
          <View style={[styles.dot, { backgroundColor: DOT[update.severity] }, !unread && styles.dotRead]} />
        </View>
      }
      trailing={
        <View style={styles.trailing}>
          {unread && (
            <Text variant="caption" tone="primary" style={styles.new}>
              New
            </Text>
          )}
          <PersonTag personId={update.personId} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  dotWrap: { width: 24, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotRead: { opacity: 0.3 },
  trailing: { alignItems: 'flex-end', gap: 4 },
  new: { fontFamily: 'InstrumentSans-Bold' },
});
