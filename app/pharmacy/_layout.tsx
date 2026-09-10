import { Stack } from 'expo-router';

import { Colors } from '@/constants/colors';

export default function PharmacyLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: Colors.light.text,
        headerStyle: { backgroundColor: Colors.surface },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Pharmacies' }} />
      <Stack.Screen name="[id]" options={{ title: 'Shop Details' }} />
    </Stack>
  );
}
