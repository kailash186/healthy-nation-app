import { Tabs } from 'expo-router';
import { Bell, CalendarDays, ClipboardList, FolderHeart, LayoutDashboard, Users } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { Text, useBreakpoint } from '@/components/ui';
import { useHealthData } from '@/lib/data/store';
import { openTasks, unreadUpdates } from '@/lib/data/selectors';

/**
 * Bottom tabs on phones; a left sidebar (React Navigation 7 `tabBarPosition: 'left'`)
 * on tablets and desktop. Same routes either way.
 */
export default function TabLayout() {
  const { isMobile, isDesktop } = useBreakpoint();
  const insets = useSafeAreaInsets();
  const { data, selectedPersonId } = useHealthData();
  const unread = unreadUpdates(data, selectedPersonId).length;
  const tasks = openTasks(data, selectedPersonId).length;
  const sidebar = !isMobile;

  return (
    <Tabs
      screenOptions={{
        tabBarPosition: sidebar ? 'left' : 'bottom',
        tabBarVariant: sidebar ? 'material' : 'uikit',
        tabBarLabelPosition: sidebar && isDesktop ? 'beside-icon' : 'below-icon',
        tabBarActiveTintColor: sidebar ? Colors.onPrimary : Colors.primary,
        tabBarInactiveTintColor: sidebar ? Colors.secondary : Colors.light.tabIconDefault,
        tabBarActiveBackgroundColor: sidebar ? 'rgba(45,139,139,0.28)' : undefined,
        tabBarLabelStyle: { fontFamily: sidebar && isDesktop ? Fonts.heading : Fonts.body, fontSize: sidebar && isDesktop ? 14 : 11 },
        tabBarItemStyle: sidebar ? { borderRadius: 12, marginHorizontal: 10, marginVertical: 2, minHeight: 44 } : undefined,
        tabBarStyle: sidebar
          ? { backgroundColor: Colors.navy, borderRightWidth: 0, width: isDesktop ? 240 : 88, paddingTop: insets.top + 96 }
          : { backgroundColor: Colors.surface, borderTopColor: Colors.light.border },
        tabBarBadgeStyle: { backgroundColor: Colors.status.error, fontFamily: Fonts.heading, fontSize: 10 },
        headerStyle: { backgroundColor: Colors.navy },
        headerTintColor: Colors.onPrimary,
        headerTitleStyle: { fontFamily: Fonts.heading, color: Colors.onPrimary, fontSize: 18 },
        headerShadowVisible: false,
        headerShown: isMobile,
        sceneStyle: { backgroundColor: Colors.background },
        tabBarBackground: sidebar
          ? () => (
              <View style={[styles.sidebarBg, { paddingTop: insets.top + 20 }]}>
                <View style={styles.brandRow}>
                  <View style={styles.brandMark}>
                    <FolderHeart size={18} color={Colors.onPrimary} />
                  </View>
                  {isDesktop && (
                    <View>
                      <Text variant="subheading" tone="inverse">
                        Healthy Nation
                      </Text>
                      <Text variant="caption" style={{ color: Colors.secondary }}>
                        Care coordination
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )
          : undefined,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="appointments"
        options={{ title: 'Appointments', tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Care tasks',
          tabBarBadge: tasks > 0 ? tasks : undefined,
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="updates"
        options={{
          title: 'Updates',
          tabBarBadge: unread > 0 ? unread : undefined,
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="care"
        options={{ title: 'Care circle', tabBarIcon: ({ color, size }) => <Users color={color} size={size} /> }}
      />
      <Tabs.Screen name="reminders" options={{ href: null, title: 'Reminders' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  sidebarBg: { flex: 1, backgroundColor: Colors.navy, paddingHorizontal: 16 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'center' },
  brandMark: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
});
