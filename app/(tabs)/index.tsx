import { useRouter } from 'expo-router';
import {
  Activity,
  Ambulance,
  Droplet,
  Heart,
  Pill,
  Stethoscope,
  Truck,
  Video,
  Wind,
} from 'lucide-react-native';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { APPOINTMENTS, DOCTORS, VITALS, type Vital } from '@/constants/mocks';

const VITAL_ICONS: Record<Vital['icon'], typeof Heart> = {
  Heart,
  Activity,
  Wind,
  Droplet,
};

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const services = [
    { label: 'Pharmacy', icon: Pill, onPress: () => router.push('/pharmacy') },
    {
      label: 'Emergency',
      icon: Ambulance,
      onPress: () => Alert.alert('Emergency', 'Calling emergency services (demo).'),
    },
    { label: 'Doctors', icon: Stethoscope, onPress: () => router.push('/doctors') },
    { label: 'Delivery', icon: Truck, onPress: () => router.push('/pharmacy') },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      testID="home-screen"
    >
      <Text style={styles.sectionTitle}>Daily Vitals</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {VITALS.map((vital) => {
          const Icon = VITAL_ICONS[vital.icon];
          return (
            <View key={vital.id} style={styles.vitalCard}>
              <Icon color={Colors.primary} size={22} />
              <Text style={styles.vitalValue}>
                {vital.value}
                <Text style={styles.vitalUnit}> {vital.unit}</Text>
              </Text>
              <Text style={styles.vitalLabel}>{vital.label}</Text>
              <Text style={styles.trend}>{vital.trend}</Text>
            </View>
          );
        })}
      </ScrollView>

      <Pressable style={styles.banner} onPress={() => router.push('/assistant')}>
        <Text style={styles.bannerTitle}>AI Symptom Check</Text>
        <Text style={styles.bannerSubtitle}>Describe how you feel and get instant guidance.</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Quick Services</Text>
      <View style={styles.grid}>
        {services.map(({ label, icon: Icon, onPress }) => (
          <Pressable key={label} style={styles.serviceCard} onPress={onPress}>
            <Icon color={Colors.accent} size={24} />
            <Text style={styles.serviceLabel}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
      {APPOINTMENTS.map((appointment) => {
        const doctor = DOCTORS.find((d) => d.id === appointment.doctorId);
        return (
          <View key={appointment.id} style={styles.appointmentCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.appointmentDoctor}>{doctor?.name ?? 'Doctor'}</Text>
              <Text style={styles.appointmentMeta}>
                {doctor?.specialty} · {appointment.date} at {appointment.time}
              </Text>
            </View>
            {appointment.type === 'video' && (
              <Pressable
                style={styles.videoButton}
                onPress={() => Alert.alert('Video call', 'Joining consultation (demo).')}
              >
                <Video color="#fff" size={18} />
              </Pressable>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  row: { paddingHorizontal: 16, gap: 12 },
  vitalCard: {
    width: 140,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  vitalValue: { fontSize: 20, fontWeight: '700', color: Colors.light.text, marginTop: 8 },
  vitalUnit: { fontSize: 12, fontWeight: '400', color: Colors.light.textSecondary },
  vitalLabel: { fontSize: 13, color: Colors.light.textSecondary, marginTop: 2 },
  trend: { fontSize: 12, color: Colors.status.success, marginTop: 4, textTransform: 'capitalize' },
  banner: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
  },
  bannerTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  bannerSubtitle: { color: '#E0ECFF', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 },
  serviceCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  serviceLabel: { marginTop: 8, fontWeight: '600', color: Colors.light.text },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  appointmentDoctor: { fontWeight: '700', color: Colors.light.text },
  appointmentMeta: { color: Colors.light.textSecondary, marginTop: 2, fontSize: 13 },
  videoButton: { backgroundColor: Colors.accent, borderRadius: 999, padding: 10 },
});
