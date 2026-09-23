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
import { Fonts } from '@/constants/typography';
import { APPOINTMENTS, DOCTORS, USER_PROFILE, VITALS, type Vital } from '@/constants/mocks';

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
      <View style={styles.hero}>
        <Text style={styles.heroGreeting}>Good morning, {USER_PROFILE.name.split(' ')[0]}</Text>
        <Text style={styles.heroSubtitle}>All vitals within normal range today</Text>
      </View>

      <Text style={styles.sectionTitle}>Daily Vitals</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {VITALS.map((vital) => {
          const Icon = VITAL_ICONS[vital.icon];
          return (
            <View key={vital.id} style={styles.vitalCard}>
              <View style={styles.iconBubble}>
                <Icon color={Colors.primary} size={20} />
              </View>
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
            <View style={styles.iconBubble}>
              <Icon color={Colors.primary} size={22} />
            </View>
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
                <Video color={Colors.onPrimary} size={18} />
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
  hero: {
    backgroundColor: Colors.navy,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroGreeting: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.onPrimary },
  heroSubtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.secondary, marginTop: 4 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.heading,
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
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.seafoamTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vitalValue: { fontSize: 20, fontFamily: Fonts.heading, color: Colors.light.text, marginTop: 8 },
  vitalUnit: { fontFamily: Fonts.body, fontSize: 12, color: Colors.light.textSecondary },
  vitalLabel: { fontFamily: Fonts.body, fontSize: 13, color: Colors.light.textSecondary, marginTop: 2 },
  trend: { fontFamily: Fonts.body, fontSize: 12, color: Colors.status.success, marginTop: 4, textTransform: 'capitalize' },
  banner: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
  },
  bannerTitle: { color: Colors.onPrimary, fontSize: 17, fontFamily: Fonts.heading },
  bannerSubtitle: { fontFamily: Fonts.body, color: Colors.secondary, marginTop: 4 },
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
  serviceLabel: { marginTop: 8, fontFamily: Fonts.heading, color: Colors.light.text },
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
  appointmentDoctor: { fontFamily: Fonts.heading, color: Colors.light.text },
  appointmentMeta: { fontFamily: Fonts.body, color: Colors.light.textSecondary, marginTop: 2, fontSize: 13 },
  videoButton: { backgroundColor: Colors.primary, borderRadius: 999, padding: 10 },
});
