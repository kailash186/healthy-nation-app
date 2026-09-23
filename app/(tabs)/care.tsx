import { useRouter } from 'expo-router';
import { Building2, ChevronRight, HeartPulse, Stethoscope, UserPlus } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { PageHeader } from '@/components/PageHeader';
import { Avatar, Badge, Card, EmptyState, ListRow, Screen, SectionHeader, Text, useBreakpoint } from '@/components/ui';
import { Colors } from '@/constants/colors';
import { useHealthData } from '@/lib/data/store';
import { reminderCountForPerson } from '@/lib/data/selectors';
import { formatAge, PROVIDER_KIND_LABEL, RELATIONSHIP_LABEL } from '@/lib/format';

/** Care circle: the people you coordinate care for, their providers, and care plans. */
export default function CareScreen() {
  const router = useRouter();
  const { data } = useHealthData();
  const { columns } = useBreakpoint();

  return (
    <Screen>
      <PageHeader title="Care circle" subtitle="People, providers and care plans in one place." />

      <SectionHeader title="People" count={data.people.length} />
      {data.people.length === 0 ? (
        <Card>
          <EmptyState icon={UserPlus} title="Just you for now" message="Add a family member to coordinate their appointments, tasks and records alongside your own." />
        </Card>
      ) : (
        <View style={styles.grid}>
          {data.people.map((p) => {
            const openTasks = data.tasks.filter((t) => t.personId === p.id && !t.completedAt).length;
            const plans = data.carePlans.filter((c) => c.personId === p.id).length;
            return (
              <Card
                key={p.id}
                onPress={() => router.push({ pathname: '/people/[id]', params: { id: p.id } })}
                style={[styles.personCard, { flexBasis: `${100 / columns - 2}%` }]}
              >
                <View style={styles.personHead}>
                  <Avatar person={p} size={48} />
                  <View style={{ flex: 1 }}>
                    <Text variant="heading">{p.name}</Text>
                    <Text variant="caption" tone="muted">
                      {RELATIONSHIP_LABEL[p.relationship]} · {formatAge(p.dateOfBirth)} yrs
                      {p.bloodType ? ` · ${p.bloodType}` : ''}
                    </Text>
                  </View>
                  <ChevronRight size={18} color={Colors.light.tabIconDefault} />
                </View>
                <View style={styles.tags}>
                  {p.conditions.map((c) => (
                    <Badge key={c} label={c} tone="primary" />
                  ))}
                  {p.allergies.map((a) => (
                    <Badge key={a} label={`Allergy: ${a}`} tone="warning" />
                  ))}
                </View>
                <Text variant="caption" tone="muted">
                  {openTasks} open {openTasks === 1 ? 'task' : 'tasks'} · {reminderCountForPerson(data.reminders, p.id)} reminders · {plans}{' '}
                  {plans === 1 ? 'care plan' : 'care plans'}
                </Text>
              </Card>
            );
          })}
        </View>
      )}

      <SectionHeader title="Care plans" count={data.carePlans.length} />
      <Card padded={false} style={styles.listCard}>
        {data.carePlans.length === 0 ? (
          <EmptyState compact icon={HeartPulse} title="No care plans" message="Ongoing plans from your providers — goals, steps and review dates — will be tracked here." />
        ) : (
          data.carePlans.map((plan) => {
            const person = data.people.find((p) => p.id === plan.personId);
            const done = plan.steps.filter((s) => s.done).length;
            return (
              <ListRow
                key={plan.id}
                title={plan.title}
                subtitle={`${person?.name ?? ''} · ${done}/${plan.steps.length} steps complete`}
                leading={person ? <Avatar person={person} size={32} /> : <HeartPulse size={20} color={Colors.primary} />}
                onPress={() => router.push({ pathname: '/care-plans/[id]', params: { id: plan.id } })}
              />
            );
          })
        )}
      </Card>

      <SectionHeader title="Providers" count={data.providers.length} />
      <Card padded={false} style={styles.listCard}>
        {data.providers.length === 0 ? (
          <EmptyState compact icon={Stethoscope} title="No providers yet" message="Doctors, clinics and pharmacies you work with will be listed here with contact details." />
        ) : (
          data.providers.map((pr) => (
            <ListRow
              key={pr.id}
              title={pr.name}
              subtitle={[PROVIDER_KIND_LABEL[pr.kind], pr.specialty, pr.organisation].filter(Boolean).join(' · ')}
              leading={
                <View style={styles.providerIcon}>
                  {pr.kind === 'pharmacy' || pr.kind === 'hospital' ? <Building2 size={18} color={Colors.primary} /> : <Stethoscope size={18} color={Colors.primary} />}
                </View>
              }
              trailing={
                <View style={styles.avatarStack}>
                  {pr.personIds.map((id) => {
                    const person = data.people.find((p) => p.id === id);
                    return person ? (
                      <View key={id} style={styles.stacked}>
                        <Avatar person={person} size={22} />
                      </View>
                    ) : null;
                  })}
                </View>
              }
              onPress={() => router.push({ pathname: '/providers/[id]', params: { id: pr.id } })}
            />
          ))
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 },
  personCard: { flexGrow: 1, gap: 12 },
  personHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  listCard: { paddingHorizontal: 12 },
  providerIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.seafoamTint, alignItems: 'center', justifyContent: 'center' },
  avatarStack: { flexDirection: 'row' },
  stacked: { marginLeft: -6, borderWidth: 2, borderColor: Colors.surface, borderRadius: 13 },
});
