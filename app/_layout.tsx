import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { HealthDataProvider } from '@/lib/data/store';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    [Fonts.body]: require('../assets/fonts/InstrumentSans-Regular.ttf'),
    [Fonts.heading]: require('../assets/fonts/InstrumentSans-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HealthDataProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerTintColor: Colors.onPrimary,
              headerStyle: { backgroundColor: Colors.navy },
              headerTitleStyle: { fontFamily: Fonts.heading, color: Colors.onPrimary },
              headerBackTitle: 'Back',
              headerShadowVisible: false,
              contentStyle: { backgroundColor: Colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="appointments/[id]" options={{ title: 'Appointment' }} />
            <Stack.Screen name="tasks/[id]" options={{ title: 'Task' }} />
            <Stack.Screen name="tasks/new" options={{ title: 'New task', presentation: 'modal' }} />
            <Stack.Screen name="updates/[id]" options={{ title: 'Update' }} />
            <Stack.Screen name="providers/[id]" options={{ title: 'Provider' }} />
            <Stack.Screen name="people/[id]" options={{ title: 'Profile' }} />
            <Stack.Screen name="records/[id]" options={{ title: 'Record' }} />
            <Stack.Screen name="care-plans/[id]" options={{ title: 'Care plan' }} />
          </Stack>
        </HealthDataProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
