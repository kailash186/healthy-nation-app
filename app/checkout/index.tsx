import { useLocalSearchParams, useRouter } from 'expo-router';
import { Banknote, CreditCard, Smartphone } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { MEDICAL_SHOPS } from '@/constants/mocks';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'wallet', label: 'Apple Pay / Google Pay', icon: Smartphone },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
] as const;

type PaymentMethod = (typeof PAYMENT_METHODS)[number]['id'];

export default function CheckoutScreen() {
  const { shopId } = useLocalSearchParams<{ shopId?: string }>();
  const router = useRouter();
  const shop = MEDICAL_SHOPS.find((s) => s.id === shopId);
  const [method, setMethod] = useState<PaymentMethod>('card');

  const placeOrder = () => {
    Alert.alert('Order placed', `Your order from ${shop?.name ?? 'the pharmacy'} is on its way.`, [
      { text: 'OK', onPress: () => router.dismissTo('/') },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{shop ? `Ordering from ${shop.name}` : 'Checkout'}</Text>
      <Text style={styles.subtitle}>Choose a payment method</Text>

      {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => {
        const selected = id === method;
        return (
          <Pressable key={id} style={[styles.option, selected && styles.optionSelected]} onPress={() => setMethod(id)}>
            <Icon color={selected ? Colors.primary : Colors.light.textSecondary} size={20} />
            <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{label}</Text>
          </Pressable>
        );
      })}

      <Pressable style={styles.button} onPress={placeOrder}>
        <Text style={styles.buttonText}>Place Order</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  title: { fontSize: 20, fontFamily: Fonts.heading, color: Colors.light.text },
  subtitle: { fontFamily: Fonts.body, color: Colors.light.textSecondary, marginTop: 4, marginBottom: 16 },
  option: {
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
  optionSelected: { borderColor: Colors.primary, backgroundColor: Colors.seafoamTint },
  optionLabel: { fontFamily: Fonts.body, color: Colors.light.text },
  optionLabelSelected: { fontFamily: Fonts.heading },
  button: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: Colors.onPrimary, fontFamily: Fonts.heading },
});
