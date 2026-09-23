import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Colors } from '@/constants/colors';

import { Text } from './Text';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  size?: 'md' | 'sm';
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, variant = 'primary', icon: Icon, loading, disabled, size = 'md', style }: Props) {
  const isDisabled = disabled || loading;
  const textColor = variant === 'primary' || variant === 'danger' ? Colors.onPrimary : variant === 'secondary' ? Colors.primaryDark : Colors.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [
        styles.base,
        size === 'sm' && styles.sm,
        variants[variant],
        hovered && !isDisabled && styles.hovered,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 15 : 17} color={textColor} />}
          <Text variant={size === 'sm' ? 'caption' : 'subheading'} style={{ color: textColor, fontFamily: 'InstrumentSans-Bold' }}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  sm: { minHeight: 36, paddingHorizontal: 14, borderRadius: 10 },
  hovered: { opacity: 0.92 },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
});

const variants = StyleSheet.create({
  primary: { backgroundColor: Colors.primary },
  secondary: { backgroundColor: Colors.seafoamTint, borderWidth: 1, borderColor: Colors.secondary },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: Colors.status.error },
});
