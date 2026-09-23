import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { MEDICAL_SHOPS } from '@/constants/mocks';

export default function PharmacyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const shop = MEDICAL_SHOPS.find((s) => s.id === id);

  if (!shop) {
    return (
      <View style={styles.center}>
        <Text style={styles.meta}>Pharmacy not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{shop.name}</Text>
      <Text style={styles.meta}>{shop.address}</Text>
      <Text style={styles.meta}>
        {shop.distance} away · Delivery in {shop.deliveryTime}
      </Text>
      <Text style={styles.meta}>Rating {shop.rating} / 5</Text>
      {shop.open247 && <Text style={styles.badge}>Open 24/7 for emergencies</Text>}

      <Pressable
        style={styles.button}
        onPress={() => router.push({ pathname: '/checkout', params: { shopId: shop.id } })}
      >
        <Text style={styles.buttonText}>Order for Delivery</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 22, fontFamily: Fonts.heading, color: Colors.light.text },
  meta: { fontFamily: Fonts.body, color: Colors.light.textSecondary, marginTop: 6 },
  badge: { marginTop: 12, color: Colors.status.error, fontFamily: Fonts.heading },
  button: {
    marginTop: 28,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: Colors.onPrimary, fontFamily: Fonts.heading },
});
