import { ChevronRight, Shield, Smartphone, Settings as SettingsIcon } from 'lucide-react-native';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { USER_PROFILE } from '@/constants/mocks';

const SETTINGS = [
  { label: 'Connected Devices', icon: Smartphone },
  { label: 'Insurance', icon: Shield },
  { label: 'Preferences', icon: SettingsIcon },
];

export default function ProfileScreen() {
  const stats = [
    { label: 'Age', value: String(USER_PROFILE.age) },
    { label: 'Blood', value: USER_PROFILE.bloodType },
    { label: 'Weight', value: `${USER_PROFILE.weightKg} kg` },
    { label: 'Height', value: `${USER_PROFILE.heightCm} cm` },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{USER_PROFILE.name.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{USER_PROFILE.name}</Text>
      </View>

      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.stat}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Medical History</Text>
      {USER_PROFILE.history.map((entry) => (
        <View key={entry.id} style={styles.historyItem}>
          <Text style={styles.historyDate}>{entry.date}</Text>
          <Text style={styles.historyTitle}>{entry.title}</Text>
          <Text style={styles.historyResult}>{entry.result}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Settings</Text>
      {SETTINGS.map(({ label, icon: Icon }) => (
        <Pressable
          key={label}
          style={styles.settingRow}
          onPress={() => Alert.alert(label, 'Coming soon.')}
        >
          <Icon color={Colors.primary} size={20} />
          <Text style={styles.settingLabel}>{label}</Text>
          <ChevronRight color={Colors.light.textSecondary} size={18} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  header: { alignItems: 'center', marginVertical: 12 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.navy,
    borderWidth: 3,
    borderColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: Colors.onPrimary, fontSize: 32, fontFamily: Fonts.heading },
  name: { marginTop: 10, fontSize: 20, fontFamily: Fonts.heading, color: Colors.light.text },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  stat: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statValue: { fontFamily: Fonts.heading, color: Colors.light.text },
  statLabel: { fontFamily: Fonts.body, fontSize: 12, color: Colors.light.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontFamily: Fonts.heading, color: Colors.light.text, marginTop: 24, marginBottom: 10 },
  historyItem: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  historyDate: { fontFamily: Fonts.body, fontSize: 12, color: Colors.light.textSecondary },
  historyTitle: { fontFamily: Fonts.heading, color: Colors.light.text, marginTop: 2 },
  historyResult: { fontFamily: Fonts.body, color: Colors.light.textSecondary, marginTop: 2, fontSize: 13 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  settingLabel: { flex: 1, color: Colors.light.text, fontFamily: Fonts.body },
});
