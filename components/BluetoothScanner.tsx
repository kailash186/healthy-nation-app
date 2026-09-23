import { Bluetooth, Check, Watch } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';

export interface WearableDevice {
  id: string;
  name: string;
  battery: number;
}

const MOCK_DEVICES: WearableDevice[] = [
  { id: 'd1', name: 'Apple Watch Series 9', battery: 82 },
  { id: 'd2', name: 'Mi Band 8', battery: 64 },
  { id: 'd3', name: 'Galaxy Watch 6', battery: 91 },
];

type Phase = 'scanning' | 'list' | 'pairing' | 'done';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConnected: (device: WearableDevice) => void;
}

export default function BluetoothScanner({ visible, onClose, onConnected }: Props) {
  const [phase, setPhase] = useState<Phase>('scanning');
  const [selected, setSelected] = useState<WearableDevice | null>(null);

  useEffect(() => {
    if (!visible) return;
    setPhase('scanning');
    setSelected(null);
    const timer = setTimeout(() => setPhase('list'), 1500);
    return () => clearTimeout(timer);
  }, [visible]);

  useEffect(() => {
    if (phase !== 'pairing' || !selected) return;
    const timer = setTimeout(() => setPhase('done'), 1800);
    return () => clearTimeout(timer);
  }, [phase, selected]);

  useEffect(() => {
    if (phase !== 'done' || !selected) return;
    const timer = setTimeout(() => onConnected(selected), 800);
    return () => clearTimeout(timer);
  }, [phase, selected, onConnected]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Bluetooth color={Colors.primary} size={32} />
          {phase === 'scanning' && (
            <>
              <Text style={styles.title}>Scanning for devices…</Text>
              <ActivityIndicator color={Colors.primary} style={{ marginTop: 16 }} />
            </>
          )}
          {phase === 'list' && (
            <>
              <Text style={styles.title}>Select a device</Text>
              {MOCK_DEVICES.map((device) => (
                <Pressable
                  key={device.id}
                  style={styles.deviceRow}
                  onPress={() => {
                    setSelected(device);
                    setPhase('pairing');
                  }}
                >
                  <Watch color={Colors.light.text} size={20} />
                  <Text style={styles.deviceName}>{device.name}</Text>
                </Pressable>
              ))}
            </>
          )}
          {phase === 'pairing' && (
            <>
              <Text style={styles.title}>Pairing with {selected?.name}…</Text>
              <ActivityIndicator color={Colors.primary} style={{ marginTop: 16 }} />
            </>
          )}
          {phase === 'done' && (
            <>
              <Check color={Colors.status.success} size={32} />
              <Text style={styles.title}>Connected!</Text>
            </>
          )}
          <Pressable style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  sheet: { backgroundColor: Colors.surface, borderRadius: 20, padding: 24, alignItems: 'center' },
  title: { marginTop: 12, fontSize: 17, fontFamily: Fonts.heading, color: Colors.light.text },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'stretch',
    padding: 12,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  deviceName: { color: Colors.light.text, fontFamily: Fonts.body },
  cancel: { marginTop: 20 },
  cancelText: { fontFamily: Fonts.body, color: Colors.light.textSecondary },
});
