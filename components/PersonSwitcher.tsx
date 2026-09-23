import { Users } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { useHealthData } from '@/lib/data/store';

import { Avatar, Text } from './ui';

/** Horizontal chip row to switch between "Everyone" and each family member. */
export function PersonSwitcher() {
  const { data, selectedPersonId, setSelectedPersonId } = useHealthData();
  if (data.people.length <= 1) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.row}>
      <Chip
        active={selectedPersonId === null}
        onPress={() => setSelectedPersonId(null)}
        leading={
          <View style={[styles.everyoneIcon, selectedPersonId === null && styles.everyoneIconActive]}>
            <Users size={14} color={selectedPersonId === null ? Colors.onPrimary : Colors.primary} />
          </View>
        }
        label="Everyone"
      />
      {data.people.map((p) => (
        <Chip
          key={p.id}
          active={selectedPersonId === p.id}
          onPress={() => setSelectedPersonId(p.id)}
          leading={<Avatar person={p} size={24} />}
          label={p.relationship === 'self' ? 'Me' : p.name.split(' ')[0]}
        />
      ))}
    </ScrollView>
  );
}

function Chip({ active, onPress, leading, label }: { active: boolean; onPress: () => void; leading: React.ReactNode; label: string }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [styles.chip, pressed && { opacity: 0.85 }, active && styles.chipActive, hovered && !active && styles.chipHover]}
    >
      {leading}
      <Text variant="caption" style={[styles.chipLabel, active && styles.chipLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0, marginBottom: 16 },
  row: { gap: 8, paddingVertical: 2 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 6,
    paddingRight: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.surface,
    minHeight: 40,
  },
  chipActive: { backgroundColor: Colors.navy, borderColor: Colors.navy },
  chipHover: { borderColor: Colors.secondary },
  chipLabel: { fontFamily: 'InstrumentSans-Bold', color: Colors.light.text },
  chipLabelActive: { color: Colors.onPrimary },
  everyoneIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.seafoamTint, alignItems: 'center', justifyContent: 'center' },
  everyoneIconActive: { backgroundColor: Colors.primary },
});
