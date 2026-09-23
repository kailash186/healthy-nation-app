import { Stack } from 'expo-router';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';

export default function PharmacyLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: Colors.onPrimary,
        headerStyle: { backgroundColor: Colors.navy },
        headerTitleStyle: { fontFamily: Fonts.heading, color: Colors.onPrimary },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Pharmacies' }} />
      <Stack.Screen name="[id]" options={{ title: 'Shop Details' }} />
    </Stack>
  );
}
