import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';

import { useBreakpoint } from './useBreakpoint';

interface Props {
  children: ReactNode;
  /** max content width on large screens */
  maxWidth?: number;
  contentStyle?: ViewStyle;
  scroll?: boolean;
}

/** Page container: centred, width-capped column with responsive padding. */
export function Screen({ children, maxWidth = 1100, contentStyle, scroll = true }: Props) {
  const insets = useSafeAreaInsets();
  const { isMobile } = useBreakpoint();
  const padding = isMobile ? 16 : 32;
  const inner = (
    <View style={[styles.inner, { maxWidth, paddingHorizontal: padding, paddingTop: isMobile ? 8 : 24 }, contentStyle]}>
      {children}
    </View>
  );
  if (!scroll) return <View style={styles.root}>{inner}</View>;
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      keyboardShouldPersistTaps="handled"
    >
      {inner}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, alignItems: 'center' },
  inner: { width: '100%' },
});
