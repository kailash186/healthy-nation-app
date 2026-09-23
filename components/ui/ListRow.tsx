import { ChevronRight } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';

import { Text } from './Text';

interface Props {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  chevron?: boolean;
  muted?: boolean;
}

export function ListRow({ title, subtitle, leading, trailing, onPress, chevron = !!onPress, muted }: Props) {
  const body = (
    <>
      {leading && <View style={styles.leading}>{leading}</View>}
      <View style={styles.text}>
        <Text variant="subheading" style={[muted && styles.muted]} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" tone="muted" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
      {chevron && <ChevronRight size={18} color={Colors.light.tabIconDefault} />}
    </>
  );
  if (!onPress) return <View style={styles.row}>{body}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [
        styles.row,
        hovered && styles.hovered,
        pressed && styles.pressed,
      ]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 4, minHeight: 56 },
  leading: { width: 40, alignItems: 'center' },
  text: { flex: 1, gap: 2 },
  muted: { color: Colors.light.textSecondary, textDecorationLine: 'line-through' },
  hovered: { backgroundColor: Colors.seafoamTint, borderRadius: 10 },
  pressed: { opacity: 0.8 },
});
