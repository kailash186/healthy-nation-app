import { Tabs } from 'expo-router';
import { Activity, Home, MessageSquareHeart, Stethoscope, User } from 'lucide-react-native';

import { Colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tabIconSelected,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.light.text,
        tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.light.border },
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
