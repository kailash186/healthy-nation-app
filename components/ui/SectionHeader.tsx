import { Link, type Href } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';

import { Text } from './Text';

interface Props {
  title: string;
  count?: number;
  href?: Href;
  linkLabel?: string;
}

export function SectionHeader({ title, count, href, linkLabel = 'View all' }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.titleRow}>
        <Text variant="heading">{title}</Text>
        {typeof count === 'number' && count > 0 && (
          <View style={styles.count}>
            <Text variant="caption" style={styles.countText}>
              {count}
            </Text>
          </View>
        )}
      </View>
      {href && (
        <Link href={href} asChild>
          <View style={styles.link} accessibilityRole="link">
            <Text variant="caption" tone="primary" style={{ fontFamily: 'InstrumentSans-Bold' }}>
              {linkLabel}
            </Text>
            <ChevronRight size={14} color={Colors.primary} />
          </View>
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  count: { backgroundColor: Colors.seafoamTint, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 1 },
  countText: { color: Colors.primaryDark, fontFamily: 'InstrumentSans-Bold' },
  link: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
