import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';
import type { Person } from '@/lib/data/types';

import { Text } from './Text';

export function Avatar({ person, size = 40 }: { person: Pick<Person, 'initials' | 'color'>; size?: number }) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: person.color },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.38, lineHeight: size * 0.5 }]}>{person.initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  text: { color: Colors.onPrimary, fontFamily: 'InstrumentSans-Bold' },
});
