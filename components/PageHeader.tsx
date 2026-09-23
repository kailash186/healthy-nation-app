import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text, useBreakpoint } from './ui';

/** Large title shown on tablet/desktop where the native header is hidden. */
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  const { isMobile } = useBreakpoint();
  return (
    <View style={[styles.row, isMobile && styles.rowMobile]}>
      <View style={styles.text}>
        {!isMobile && <Text variant="display">{title}</Text>}
        {subtitle && (
          <Text variant="body" tone="muted">
            {subtitle}
          </Text>
        )}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 },
  rowMobile: { marginBottom: 12 },
  text: { flex: 1, gap: 4 },
});
