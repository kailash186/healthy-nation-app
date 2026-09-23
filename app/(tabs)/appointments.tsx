import { CalendarDays, History } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppointmentCard } from '@/components/AppointmentCard';
import { PageHeader } from '@/components/PageHeader';
import { PersonSwitcher } from '@/components/PersonSwitcher';
import { Card, EmptyState, Screen, SectionHeader, Text } from '@/components/ui';
import { useHealthData } from '@/lib/data/store';
import { pastAppointments, upcomingAppointments } from '@/lib/data/selectors';
import { formatLongDate } from '@/lib/format';

export default function AppointmentsScreen() {
  const { data, selectedPersonId } = useHealthData();
  const upcoming = upcomingAppointments(data, selectedPersonId);
  const past = pastAppointments(data, selectedPersonId);

  // group upcoming by day
  const groups = upcoming.reduce<Record<string, typeof upcoming>>((acc, a) => {
    const key = a.startsAt.slice(0, 10);
    (acc[key] ??= []).push(a);
    return acc;
  }, {});

  return (
    <Screen>
      <PageHeader title="Appointments" subtitle="Upcoming visits, calls and what to prepare." />
      <PersonSwitcher />

      {upcoming.length === 0 ? (
        <Card>
          <EmptyState
            icon={CalendarDays}
            title="Nothing scheduled"
            message="Booked visits will appear here, grouped by day, with prep notes and provider details."
          />
        </Card>
      ) : (
        Object.entries(groups).map(([day, items]) => (
          <View key={day} style={styles.group}>
            <Text variant="label" tone="muted" style={styles.day}>
              {formatLongDate(items[0].startsAt)}
            </Text>
            <View style={styles.list}>
              {items.map((a) => (
                <AppointmentCard key={a.id} appointment={a} />
              ))}
            </View>
          </View>
        ))
      )}

      <SectionHeader title="Past" count={past.length} />
      {past.length === 0 ? (
        <Card>
          <EmptyState compact icon={History} title="No past visits yet" message="Completed appointments and their summaries will be kept here." />
        </Card>
      ) : (
        <View style={styles.list}>
          {past.map((a) => (
            <AppointmentCard key={a.id} appointment={a} />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: 20 },
  day: { marginBottom: 10 },
  list: { gap: 10 },
});
