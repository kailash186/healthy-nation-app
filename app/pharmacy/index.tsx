import { useRouter } from 'expo-router';
import { Clock, MapPin, Star } from 'lucide-react-native';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { MEDICAL_SHOPS } from '@/constants/mocks';

export default function PharmacyListScreen() {
  const router = useRouter();

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={MEDICAL_SHOPS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable style={styles.card} onPress={() => router.push({ pathname: '/pharmacy/[id]', params: { id: item.id } })}>
          <View style={styles.header}>
            <Text style={styles.name}>{item.name}</Text>
            {item.open247 && <Text style={styles.badge}>24/7</Text>}
          </View>
          <View style={styles.metaRow}>
            <MapPin color={Colors.light.textSecondary} size={14} />
            <Text style={styles.meta}>{item.distance}</Text>
            <Clock color={Colors.light.textSecondary} size={14} />
            <Text style={styles.meta}>{item.deliveryTime}</Text>
            <Star color={Colors.status.warning} size={14} fill={Colors.status.warning} />
            <Text style={styles.meta}>{item.rating}</Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: 16, fontFamily: Fonts.heading, color: Colors.light.text },
  badge: {
    backgroundColor: Colors.status.error,
    color: Colors.onPrimary,
    fontSize: 11,
    fontFamily: Fonts.heading,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: 'hidden',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  meta: { fontFamily: Fonts.body, color: Colors.light.textSecondary, fontSize: 13, marginRight: 8 },
});
