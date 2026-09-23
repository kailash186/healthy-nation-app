import { SearchX } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Card, EmptyState, Screen, Text } from './ui';

/** Consistent frame for detail pages: eyebrow, title, then content sections. */
export function DetailShell({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: string; subtitle?: string; children: ReactNode }) {
  return (
    <Screen maxWidth={760}>
      <View style={styles.head}>
        {eyebrow && (
          <Text variant="label" tone="primary">
            {eyebrow}
          </Text>
        )}
        <Text variant="display">{title}</Text>
        {subtitle && (
          <Text variant="body" tone="muted">
            {subtitle}
          </Text>
        )}
      </View>
      <View style={styles.body}>{children}</View>
    </Screen>
  );
}

export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="label" tone="muted" style={styles.sectionTitle}>
        {title}
      </Text>
      <Card>{children}</Card>
    </View>
  );
}

export function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.field}>
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <Text>{value}</Text>
    </View>
  );
}

export function NotFound({ what, onBack }: { what: string; onBack: () => void }) {
  return (
    <Screen maxWidth={600}>
      <Card>
        <EmptyState icon={SearchX} title={`That ${what} isn’t here`} message="It may have been removed, or the link is out of date." />
        <Button label="Go back" variant="secondary" onPress={onBack} style={{ alignSelf: 'center' }} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { gap: 6, marginBottom: 20 },
  body: { gap: 20 },
  section: { gap: 8 },
  sectionTitle: { marginLeft: 2 },
  field: { gap: 2, paddingVertical: 6 },
});
