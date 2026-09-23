import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Phone, Video } from 'lucide-react-native';
import { Alert, Linking, StyleSheet, View } from 'react-native';

import { DetailSection, DetailShell, Field, NotFound } from '@/components/DetailShell';
import { TaskRow } from '@/components/TaskRow';
import { Avatar, Badge, Button, ListRow, Text } from '@/components/ui';
import { Colors } from '@/constants/colors';
import { useHealthData } from '@/lib/data/store';
import { personById, providerById } from '@/lib/data/selectors';
import { formatLongDate, formatTime } from '@/lib/format';

export default function AppointmentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data } = useHealthData();
  const appt = data.appointments.find((a) => a.id === id);
  if (!appt) return <NotFound what="appointment" onBack={() => router.back()} />;

  const provider = providerById(data, appt.providerId);
  const person = personById(data, appt.personId);
  const linkedTasks = data.tasks.filter((t) => t.linkedAppointmentId === appt.id);
  const upcoming = appt.status === 'scheduled' && new Date(appt.startsAt).getTime() > Date.now();

  return (
    <DetailShell
      eyebrow={appt.status === 'scheduled' ? 'Upcoming appointment' : appt.status}
      title={appt.title}
      subtitle={`${formatLongDate(appt.startsAt)} at ${formatTime(appt.startsAt)} · ${appt.durationMin} min`}
    >
      {upcoming && (
        <View style={styles.actions}>
          {appt.mode === 'video' && <Button label="Join video visit" icon={Video} onPress={() => Alert.alert('Video visit', 'The link becomes active 10 minutes before the start time.')} />}
          {appt.mode === 'in-person' && appt.location && (
            <Button label="Get directions" icon={MapPin} variant="secondary" onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(appt.location ?? '')}`)} />
          )}
          {provider?.phone && <Button label="Call clinic" icon={Phone} variant="secondary" onPress={() => Linking.openURL(`tel:${provider.phone}`)} />}
        </View>
      )}

      {appt.prepNotes && (
        <DetailSection title="How to prepare">
          <Text>{appt.prepNotes}</Text>
        </DetailSection>
      )}

      {appt.summary && (
        <DetailSection title="Visit summary">
          <Text>{appt.summary}</Text>
        </DetailSection>
      )}

      <DetailSection title="Details">
        <Field label="For" value={person?.name} />
        <Field label="Mode" value={appt.mode === 'in-person' ? 'In person' : appt.mode === 'video' ? 'Video visit' : 'Phone call'} />
        <Field label="Location" value={appt.location} />
      </DetailSection>

      {provider && (
        <DetailSection title="Provider">
          <ListRow
            title={provider.name}
            subtitle={[provider.specialty, provider.organisation].filter(Boolean).join(' · ')}
            leading={person ? <Avatar person={person} size={32} /> : undefined}
            onPress={() => router.push({ pathname: '/providers/[id]', params: { id: provider.id } })}
          />
        </DetailSection>
      )}

      {linkedTasks.length > 0 && (
        <DetailSection title="Related tasks">
          {linkedTasks.map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
        </DetailSection>
      )}

      {appt.status !== 'scheduled' && <Badge label={appt.status} tone={appt.status === 'completed' ? 'success' : 'neutral'} />}
    </DetailShell>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: Colors.light.border, marginBottom: -4, paddingVertical: 4 },
});
