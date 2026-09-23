import { useRouter } from 'expo-router';
import { AlertTriangle, Bell, CalendarClock, CheckCircle2, ClipboardList, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';
import type { AttentionItem } from '@/lib/data/selectors';

import { PersonTag } from './PersonTag';
import { Card, EmptyState, Text } from './ui';

const ICONS: Record<AttentionItem['kind'], LucideIcon> = {
  update: AlertTriangle,
  task: ClipboardList,
  appointment: CalendarClock,
  reminder: Bell,
};

const URGENCY = {
  0: { tone: 'danger' as const, color: Colors.status.error, label: 'Now' },
  1: { tone: 'warning' as const, color: '#b8791b', label: 'Today' },
  2: { tone: 'default' as const, color: Colors.primary, label: 'Soon' },
};

export function AttentionList({ items, limit }: { items: AttentionItem[]; limit?: number }) {
  const router = useRouter();
  const shown = limit ? items.slice(0, limit) : items;

  if (items.length === 0) {
    return (
      <Card tone="seafoam">
        <EmptyState
          compact
          icon={CheckCircle2}
          title="You're all caught up"
          message="Nothing needs your attention right now. New tasks, results and reminders will show up here."
        />
      </Card>
    );
  }

  return (
    <View style={styles.list}>
      {shown.map((item) => {
        const Icon = ICONS[item.kind];
        const u = URGENCY[item.urgency];
        return (
          <Card key={`${item.kind}-${item.id}`} tone={u.tone} onPress={() => router.push(item.href as never)} style={styles.card}>
            <View style={[styles.icon, { backgroundColor: `${u.color}1f` }]}>
              <Icon size={18} color={u.color} />
            </View>
            <View style={styles.body}>
              <Text variant="subheading" numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.metaRow}>
                <Text variant="caption" style={{ color: u.color, fontFamily: 'InstrumentSans-Bold' }}>
                  {item.detail}
                </Text>
                <PersonTag personId={item.personId} />
              </View>
            </View>
          </Card>
        );
      })}
      {limit && items.length > limit && (
        <Text variant="caption" tone="muted" style={styles.more}>
          +{items.length - limit} more below
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  more: { textAlign: 'center', marginTop: 2 },
});
