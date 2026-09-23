import { useLocalSearchParams, useRouter } from 'expo-router';
import { FileText, StickyNote } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppointmentCard } from '@/components/AppointmentCard';
import { DetailSection, DetailShell, Field, NotFound } from '@/components/DetailShell';
import { TaskRow } from '@/components/TaskRow';
import { Avatar, Badge, Card, EmptyState, ListRow, Text } from '@/components/ui';
import { useHealthData } from '@/lib/data/store';
import { latestVitals, openTasks, upcomingAppointments } from '@/lib/data/selectors';
import { formatAge, formatDate, formatLongDate, RECORD_KIND_LABEL, RELATIONSHIP_LABEL, VITAL_LABEL } from '@/lib/format';

export default function PersonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data } = useHealthData();
  const person = data.people.find((p) => p.id === id);
  if (!person) return <NotFound what="profile" onBack={() => router.back()} />;

  const vitals = latestVitals(data, person.id);
  const appts = upcomingAppointments(data, person.id);
  const tasks = openTasks(data, person.id);
  const records = data.records.filter((r) => r.personId === person.id).sort((a, b) => b.date.localeCompare(a.date));
  const notes = data.notes.filter((n) => n.personId === person.id);
  const plans = data.carePlans.filter((c) => c.personId === person.id);
  const providers = data.providers.filter((p) => p.personIds.includes(person.id));

  return (
    <DetailShell eyebrow={RELATIONSHIP_LABEL[person.relationship]} title={person.name} subtitle={`${formatAge(person.dateOfBirth)} years · born ${formatLongDate(person.dateOfBirth)}`}>
      <View style={styles.headRow}>
        <Avatar person={person} size={64} />
        <View style={styles.tags}>
          {person.bloodType && <Badge label={`Blood ${person.bloodType}`} tone="navy" />}
          {person.conditions.map((c) => (
            <Badge key={c} label={c} tone="primary" />
          ))}
          {person.allergies.map((a) => (
            <Badge key={a} label={`Allergy: ${a}`} tone="warning" />
          ))}
        </View>
      </View>

      <DetailSection title="Latest vitals">
        {vitals.length === 0 ? (
          <Text tone="muted">No readings recorded yet.</Text>
        ) : (
          <View style={styles.vitals}>
            {vitals.map((v) => (
              <View key={v.id} style={styles.vital}>
                <Text variant="caption" tone="muted">
                  {VITAL_LABEL[v.kind]}
                </Text>
                <Text variant="heading">
                  {v.value} <Text variant="caption" tone="muted">{v.unit}</Text>
                </Text>
                <Text variant="caption" tone="muted">
                  {formatDate(v.recordedAt)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </DetailSection>

      {plans.length > 0 && (
        <DetailSection title="Care plans">
          {plans.map((p) => (
            <ListRow key={p.id} title={p.title} subtitle={`${p.steps.filter((s) => s.done).length}/${p.steps.length} steps · review ${p.reviewAt ? formatDate(p.reviewAt) : 'TBD'}`} onPress={() => router.push({ pathname: '/care-plans/[id]', params: { id: p.id } })} />
          ))}
        </DetailSection>
      )}

      <View style={styles.section}>
        <Text variant="label" tone="muted">
          Upcoming appointments
        </Text>
        {appts.length === 0 ? (
          <Card>
            <Text tone="muted">Nothing scheduled.</Text>
          </Card>
        ) : (
          appts.map((a) => <AppointmentCard key={a.id} appointment={a} />)
        )}
      </View>

      <DetailSection title="Open tasks">
        {tasks.length === 0 ? <Text tone="muted">No open tasks.</Text> : tasks.map((t) => <TaskRow key={t.id} task={t} />)}
      </DetailSection>

      <DetailSection title="Health records">
        {records.length === 0 ? (
          <EmptyState compact icon={FileText} title="No records yet" message="Lab results, visit notes, prescriptions and documents will be filed here." />
        ) : (
          records.map((r) => (
            <ListRow key={r.id} title={r.title} subtitle={`${RECORD_KIND_LABEL[r.kind]} · ${formatDate(r.date, { day: 'numeric', month: 'short', year: 'numeric' })}`} onPress={() => router.push({ pathname: '/records/[id]', params: { id: r.id } })} />
          ))
        )}
      </DetailSection>

      <DetailSection title="Notes">
        {notes.length === 0 ? (
          <EmptyState compact icon={StickyNote} title="No notes" message="Questions for the doctor, observations and anything worth remembering can go here." />
        ) : (
          notes.map((n) => (
            <View key={n.id} style={styles.note}>
              <Text variant="subheading">{n.title}</Text>
              <Text tone="muted">{n.body}</Text>
              <View style={styles.tags}>
                {n.tags.map((t) => (
                  <Badge key={t} label={t} />
                ))}
              </View>
            </View>
          ))
        )}
      </DetailSection>

      <DetailSection title="Providers">
        {providers.map((p) => (
          <ListRow key={p.id} title={p.name} subtitle={[p.specialty, p.organisation].filter(Boolean).join(' · ')} onPress={() => router.push({ pathname: '/providers/[id]', params: { id: p.id } })} />
        ))}
        <Field label="Emergency info" value={person.allergies.length ? `Allergic to ${person.allergies.join(', ')}` : 'No known allergies'} />
      </DetailSection>
    </DetailShell>
  );
}

const styles = StyleSheet.create({
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1 },
  vitals: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  vital: { minWidth: 120, gap: 2 },
  section: { gap: 10 },
  note: { gap: 6, paddingVertical: 8 },
});
