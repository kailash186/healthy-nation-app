import { StyleSheet, View } from 'react-native';

import { useHealthData } from '@/lib/data/store';
import { personById } from '@/lib/data/selectors';

import { Avatar, Text } from './ui';

/** Small "who this is for" chip; hidden when a single person is selected. */
export function PersonTag({ personId, force }: { personId: string; force?: boolean }) {
  const { data, selectedPersonId } = useHealthData();
  if (selectedPersonId && !force) return null;
  const person = personById(data, personId);
  if (!person) return null;
  return (
    <View style={styles.row}>
      <Avatar person={person} size={18} />
      <Text variant="caption" tone="muted">
        {person.relationship === 'self' ? 'You' : person.name.split(' ')[0]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: 6 } });
