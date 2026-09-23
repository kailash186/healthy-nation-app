import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';

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
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerTintColor: Colors.onPrimary,
            headerStyle: { backgroundColor: Colors.navy },
            headerTitleStyle: { fontFamily: Fonts.heading, color: Colors.onPrimary },
            headerShadowVisible: false,
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
