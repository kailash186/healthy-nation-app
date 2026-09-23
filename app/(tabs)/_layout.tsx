import { Tabs } from 'expo-router';
import { Activity, Home, MessageSquareHeart, Stethoscope, User } from 'lucide-react-native';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarLabelStyle: { fontFamily: Fonts.body, fontSize: 11 },
        tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.light.border },
        headerStyle: { backgroundColor: Colors.navy },
        headerTintColor: Colors.onPrimary,
        headerTitleStyle: { fontFamily: Fonts.heading, color: Colors.onPrimary, fontSize: 18 },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: 'Assistant',
          tabBarIcon: ({ color, size }) => <MessageSquareHeart color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="doctors"
        options={{ title: 'Doctors', tabBarIcon: ({ color, size }) => <Stethoscope color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="health"
        options={{ title: 'Health', tabBarIcon: ({ color, size }) => <Activity color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
    </Tabs>
  );
}
