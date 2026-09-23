import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';

import { Button } from './Button';
import { Text } from './Text';

interface Props {
  icon: LucideIcon;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

/** Friendly, calm empty state. Never blames the user; always says what will appear here. */
export function EmptyState({ icon: Icon, title, message, actionLabel, onAction, compact }: Props) {
  return (
    <View style={[styles.wrap, compact && styles.compact]}>
      <View style={styles.iconRing}>
        <Icon size={compact ? 22 : 28} color={Colors.primary} strokeWidth={1.75} />
      </View>
      <Text variant={compact ? 'subheading' : 'heading'} style={styles.title}>
        {title}
      </Text>
      <Text variant={compact ? 'caption' : 'body'} tone="muted" style={styles.message}>
        {message}
      </Text>
      {actionLabel && onAction && <Button label={actionLabel} onPress={onAction} variant="secondary" size="sm" style={styles.action} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 },
  compact: { paddingVertical: 24 },
  iconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.seafoamTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: { textAlign: 'center' },
  message: { textAlign: 'center', marginTop: 6, maxWidth: 360 },
  action: { marginTop: 16 },
});
