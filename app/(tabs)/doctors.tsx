import { Search, Star } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { DOCTORS } from '@/constants/mocks';

export default function DoctorsScreen() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DOCTORS;
    return DOCTORS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.hospital.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Search color={Colors.light.textSecondary} size={18} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, specialty or hospital"
          placeholderTextColor={Colors.light.textSecondary}
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No doctors match your search.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.specialty} · {item.experience}
                </Text>
                <Text style={styles.meta}>{item.hospital}</Text>
              </View>
              <View style={styles.rating}>
                <Star color={Colors.status.warning} size={14} fill={Colors.status.warning} />
                <Text style={styles.ratingText}>
                  {item.rating} ({item.reviews})
                </Text>
              </View>
            </View>
            <Pressable
              style={[styles.button, !item.available && styles.buttonDisabled]}
              disabled={!item.available}
              onPress={() => Alert.alert('Appointment', `Booking request sent to ${item.name} (demo).`)}
            >
              <Text style={styles.buttonText}>{item.available ? 'Book Appointment' : 'Unavailable'}</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    margin: 16,
    paddingHorizontal: 14,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: { flex: 1, paddingVertical: 12, color: Colors.light.text },
  list: { paddingHorizontal: 16, paddingBottom: 24, gap: 12 },
  empty: { textAlign: 'center', color: Colors.light.textSecondary, marginTop: 40 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  name: { fontSize: 16, fontWeight: '700', color: Colors.light.text },
  meta: { color: Colors.light.textSecondary, fontSize: 13, marginTop: 2 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, color: Colors.light.text },
  button: {
    marginTop: 14,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: Colors.light.tabIconDefault },
  buttonText: { color: '#fff', fontWeight: '600' },
});
