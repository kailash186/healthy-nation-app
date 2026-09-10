import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerTintColor: Colors.light.text,
            headerStyle: { backgroundColor: Colors.surface },
            contentStyle: { backgroundColor: Colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="pharmacy" options={{ headerShown: false }} />
          <Stack.Screen name="checkout/index" options={{ title: 'Checkout' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
