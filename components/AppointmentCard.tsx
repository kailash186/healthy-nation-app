import { useRouter } from 'expo-router';
import { MapPin, Phone, Video } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { useHealthData } from '@/lib/data/store';
import { providerById } from '@/lib/data/selectors';
import type { Appointment } from '@/lib/data/types';
import { formatWhen } from '@/lib/format';

import { PersonTag } from './PersonTag';
import { Badge, Card, Text } from './ui';

const MODE_ICON = { 'in-person': MapPin, video: Video, phone: Phone } as const;
const MODE_LABEL = { 'in-person': 'In person', video: 'Video visit', phone: 'Phone call' } as const;

export function AppointmentCard({ appointment, featured }: { appointment: Appointment; featured?: boolean }) {
  const router = useRouter();
  const { data } = useHealthData();
  const provider = providerById(data, appointment.providerId);
  const Icon = MODE_ICON[appointment.mode];
  const dateObj = new Date(appointment.startsAt);

  return (
    <Card
      tone={featured ? 'navy' : 'default'}
      onPress={() => router.push({ pathname: '/appointments/[id]', params: { id: appointment.id } })}
      style={styles.card}
    >
      <View style={[styles.dateBlock, featured && styles.dateBlockFeatured]}>
        <Text variant="label" style={featured ? styles.featuredMuted : undefined} tone={featured ? undefined : 'muted'}>
          {dateObj.toLocaleDateString(undefined, { month: 'short' })}
        </Text>
        <Text variant="title" tone={featured ? 'inverse' : 'default'}>
          {dateObj.getDate()}
        </Text>
      </View>
      <View style={styles.body}>
        <Text variant="subheading" tone={featured ? 'inverse' : 'default'} numberOfLines={1}>
          {appointment.title}
        </Text>
        <Text variant="caption" style={featured ? styles.featuredMuted : undefined} tone={featured ? undefined : 'muted'} numberOfLines={1}>
          {provider?.name}
          {provider?.specialty ? ` · ${provider.specialty}` : ''}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.mode}>
            <Icon size={13} color={featured ? Colors.secondary : Colors.primary} />
            <Text variant="caption" style={featured ? { color: Colors.secondary } : { color: Colors.primaryDark }}>
              {formatWhen(appointment.startsAt)} · {MODE_LABEL[appointment.mode]}
            </Text>
          </View>
          <PersonTag personId={appointment.personId} />
        </View>
      </View>
      {appointment.status !== 'scheduled' && <Badge label={appointment.status} tone={appointment.status === 'completed' ? 'success' : 'neutral'} />}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  dateBlock: {
    width: 52,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.seafoamTint,
  },
  dateBlockFeatured: { backgroundColor: 'rgba(255,255,255,0.08)' },
  featuredMuted: { color: Colors.secondary },
  body: { flex: 1, gap: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 4 },
  mode: { flexDirection: 'row', alignItems: 'center', gap: 5 },
});
