import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors } from '@/constants/colors';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  tone?: 'default' | 'navy' | 'seafoam' | 'warning' | 'danger';
  padded?: boolean;
  accessibilityLabel?: string;
}

export function Card({ children, onPress, style, tone = 'default', padded = true, accessibilityLabel }: Props) {
  const base = [styles.card, tones[tone], padded && styles.padded, style];
  if (!onPress) return <View style={base}>{children}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [
        base,
        hovered && styles.hovered,
        pressed && styles.pressed,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.surface,
  },
  padded: { padding: 16 },
  hovered: { borderColor: Colors.secondary, boxShadow: '0 4px 12px rgba(26,35,50,0.06)' },
  pressed: { opacity: 0.85 },
});

const tones = StyleSheet.create({
  default: {},
  navy: { backgroundColor: Colors.navy, borderColor: Colors.navy },
  seafoam: { backgroundColor: Colors.seafoamTint, borderColor: Colors.secondary },
  warning: { backgroundColor: '#fdf6e7', borderColor: '#efd9a8' },
  danger: { backgroundColor: '#fbeeec', borderColor: '#f0c4bd' },
});
