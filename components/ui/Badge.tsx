import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';

import { Text } from './Text';

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'navy';

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  return (
    <View style={[styles.badge, bg[tone]]}>
      <Text variant="caption" style={[styles.text, fg[tone]]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999, alignSelf: 'flex-start' },
  text: { fontSize: 12, lineHeight: 16 },
});

const bg = StyleSheet.create({
  neutral: { backgroundColor: '#e8eef0' },
  primary: { backgroundColor: Colors.seafoamTint },
  success: { backgroundColor: '#e3f4ec' },
  warning: { backgroundColor: '#fdf1d8' },
  danger: { backgroundColor: '#fbe3df' },
  navy: { backgroundColor: Colors.navy },
});

const fg = StyleSheet.create({
  neutral: { color: Colors.light.textSecondary },
  primary: { color: Colors.primaryDark },
  success: { color: '#1f6b47' },
  warning: { color: '#8a5a12' },
  danger: { color: '#9a3b2e' },
  navy: { color: Colors.onPrimary },
});
