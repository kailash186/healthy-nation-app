import { BatteryMedium, Bluetooth, Watch } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import BluetoothScanner, { type WearableDevice } from '@/components/BluetoothScanner';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { HEALTH_PARAMETERS, VITALS } from '@/constants/mocks';

export default function HealthScreen() {
  const [scannerVisible, setScannerVisible] = useState(false);
  const [device, setDevice] = useState<WearableDevice | null>(null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.deviceCard}>
        <Watch color={Colors.secondary} size={28} />
        <View style={{ flex: 1 }}>
          <Text style={styles.deviceTitle}>{device ? device.name : 'No device connected'}</Text>
          <Text style={styles.deviceMeta}>
            {device ? `Synced just now · ${device.battery}% battery` : 'Pair a smartwatch or fitness band'}
          </Text>
        </View>
        {device ? (
          <BatteryMedium color={Colors.secondary} size={22} />
        ) : (
          <Pressable style={styles.connectButton} onPress={() => setScannerVisible(true)}>
            <Bluetooth color={Colors.onPrimary} size={16} />
            <Text style={styles.connectText}>Connect</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.sectionTitle}>Current Readings</Text>
      <View style={styles.grid}>
        {VITALS.map((vital) => (
          <View key={vital.id} style={styles.metric}>
            <Text style={styles.metricLabel}>{vital.label}</Text>
            <Text style={styles.metricValue}>
              {vital.value} <Text style={styles.metricUnit}>{vital.unit}</Text>
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Normal Ranges</Text>
      {Object.values(HEALTH_PARAMETERS).map((param) => (
        <View key={param.label} style={styles.rangeRow}>
          <Text style={styles.rangeLabel}>{param.label}</Text>
          <Text style={styles.rangeValue}>
            {param.normal} {param.unit}
          </Text>
        </View>
      ))}

      <BluetoothScanner
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onConnected={(connected) => {
          setDevice(connected);
          setScannerVisible(false);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.navy,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  deviceTitle: { fontFamily: Fonts.heading, color: Colors.onPrimary },
  deviceMeta: { fontFamily: Fonts.body, color: Colors.secondary, fontSize: 13, marginTop: 2 },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  connectText: { color: Colors.onPrimary, fontFamily: Fonts.heading, fontSize: 13 },
  sectionTitle: { fontSize: 18, fontFamily: Fonts.heading, color: Colors.light.text, marginTop: 24, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metric: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  metricLabel: { fontFamily: Fonts.body, color: Colors.light.textSecondary, fontSize: 13 },
  metricValue: { fontSize: 20, fontFamily: Fonts.heading, color: Colors.light.text, marginTop: 4 },
  metricUnit: { fontFamily: Fonts.body, fontSize: 12, color: Colors.light.textSecondary },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  rangeLabel: { fontFamily: Fonts.body, color: Colors.light.text },
  rangeValue: { fontFamily: Fonts.body, color: Colors.light.textSecondary },
});
