import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Phone } from 'lucide-react-native';
import { Linking, StyleSheet, View } from 'react-native';

import { AppointmentCard } from '@/components/AppointmentCard';
import { DetailSection, DetailShell, Field, NotFound } from '@/components/DetailShell';
import { Avatar, Button, ListRow, Text } from '@/components/ui';
import { useHealthData } from '@/lib/data/store';
import { PROVIDER_KIND_LABEL } from '@/lib/format';

export default function ProviderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data } = useHealthData();
  const provider = data.providers.find((p) => p.id === id);
  if (!provider) return <NotFound what="provider" onBack={() => router.back()} />;

  const people = data.people.filter((p) => provider.personIds.includes(p.id));
  const appts = data.appointments.filter((a) => a.providerId === provider.id).sort((a, b) => b.startsAt.localeCompare(a.startsAt));
  const records = data.records.filter((r) => r.providerId === provider.id);

  return (
    <DetailShell eyebrow={[PROVIDER_KIND_LABEL[provider.kind], provider.specialty].filter(Boolean).join(' · ')} title={provider.name} subtitle={provider.organisation}>
      <View style={styles.actions}>
        {provider.phone && <Button label="Call" icon={Phone} onPress={() => Linking.openURL(`tel:${provider.phone}`)} />}
        {provider.address && <Button label="Directions" icon={MapPin} variant="secondary" onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(provider.address ?? '')}`)} />}
      </View>

      <DetailSection title="Contact">
        <Field label="Phone" value={provider.phone} />
        <Field label="Address" value={provider.address} />
        <Field label="Notes" value={provider.notes} />
      </DetailSection>

      <DetailSection title="Cares for">
        {people.map((p) => (
          <ListRow key={p.id} title={p.name} leading={<Avatar person={p} size={32} />} onPress={() => router.push({ pathname: '/people/[id]', params: { id: p.id } })} />
        ))}
      </DetailSection>

      {appts.length > 0 && (
        <View style={styles.section}>
          <Text variant="label" tone="muted">
            Appointments
          </Text>
          {appts.map((a) => (
            <AppointmentCard key={a.id} appointment={a} />
          ))}
        </View>
      )}

      {records.length > 0 && (
        <DetailSection title="Records from this provider">
          {records.map((r) => (
            <ListRow key={r.id} title={r.title} subtitle={r.date} onPress={() => router.push({ pathname: '/records/[id]', params: { id: r.id } })} />
          ))}
        </DetailSection>
      )}
    </DetailShell>
  );
}

const styles = StyleSheet.create({ actions: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' }, section: { gap: 10 } });
