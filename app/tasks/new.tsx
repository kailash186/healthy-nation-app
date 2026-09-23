import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Avatar, Button, Card, Screen, Text } from '@/components/ui';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { useHealthData } from '@/lib/data/store';
import type { TaskPriority } from '@/lib/data/types';

const PRIORITIES: { id: TaskPriority; label: string }[] = [
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
];
const DUE_OPTIONS = [
  { id: 'today', label: 'Today', days: 0 },
  { id: 'tomorrow', label: 'Tomorrow', days: 1 },
  { id: 'week', label: 'In a week', days: 7 },
  { id: 'none', label: 'No date', days: null },
] as const;

export default function NewTaskScreen() {
  const router = useRouter();
  const { data, selectedPersonId, addTask } = useHealthData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [personId, setPersonId] = useState(selectedPersonId ?? data.people[0]?.id ?? '');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [due, setDue] = useState<(typeof DUE_OPTIONS)[number]['id']>('today');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!title.trim()) {
      setError('Give the task a short title so it’s easy to spot.');
      return;
    }
    const option = DUE_OPTIONS.find((o) => o.id === due)!;
    let dueAt: string | undefined;
    if (option.days !== null) {
      const d = new Date();
      d.setDate(d.getDate() + option.days);
      d.setHours(18, 0, 0, 0);
      dueAt = d.toISOString();
    }
    const created = addTask({ title: title.trim(), description: description.trim() || undefined, personId, priority, dueAt });
    router.replace({ pathname: '/tasks/[id]', params: { id: created.id } });
  };

  return (
    <Screen maxWidth={640}>
      <Card style={styles.form}>
        <View style={styles.field}>
          <Text variant="caption" tone="muted">
            Title
          </Text>
          <TextInput
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              if (error) setError(null);
            }}
            placeholder="e.g. Book eye exam for Mum"
            placeholderTextColor={Colors.light.tabIconDefault}
            style={[styles.input, error && styles.inputError]}
            autoFocus
            returnKeyType="next"
            accessibilityLabel="Task title"
          />
          {error && (
            <Text variant="caption" tone="danger">
              {error}
            </Text>
          )}
        </View>

        <View style={styles.field}>
          <Text variant="caption" tone="muted">
            Notes (optional)
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Anything that will help when you get to it"
            placeholderTextColor={Colors.light.tabIconDefault}
            style={[styles.input, styles.multiline]}
            multiline
            accessibilityLabel="Task notes"
          />
        </View>

        <View style={styles.field}>
          <Text variant="caption" tone="muted">
            For
          </Text>
          <View style={styles.chips}>
            {data.people.map((p) => (
              <Pressable key={p.id} onPress={() => setPersonId(p.id)} accessibilityRole="radio" accessibilityState={{ selected: personId === p.id }} style={[styles.chip, personId === p.id && styles.chipActive]}>
                <Avatar person={p} size={20} />
                <Text variant="caption" style={[styles.chipText, personId === p.id && styles.chipTextActive]}>
                  {p.relationship === 'self' ? 'Me' : p.name.split(' ')[0]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="caption" tone="muted">
            Due
          </Text>
          <View style={styles.chips}>
            {DUE_OPTIONS.map((o) => (
              <Pressable key={o.id} onPress={() => setDue(o.id)} accessibilityRole="radio" accessibilityState={{ selected: due === o.id }} style={[styles.chip, due === o.id && styles.chipActive]}>
                <Text variant="caption" style={[styles.chipText, due === o.id && styles.chipTextActive]}>
                  {o.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="caption" tone="muted">
            Priority
          </Text>
          <View style={styles.chips}>
            {PRIORITIES.map((p) => (
              <Pressable key={p.id} onPress={() => setPriority(p.id)} accessibilityRole="radio" accessibilityState={{ selected: priority === p.id }} style={[styles.chip, priority === p.id && styles.chipActive]}>
                <Text variant="caption" style={[styles.chipText, priority === p.id && styles.chipTextActive]}>
                  {p.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <Button label="Cancel" variant="ghost" onPress={() => router.back()} />
          <Button label="Add task" onPress={submit} />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: 18 },
  field: { gap: 6 },
  input: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
  },
  inputError: { borderColor: Colors.status.error },
  multiline: { minHeight: 88, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.surface,
    minHeight: 36,
  },
  chipActive: { backgroundColor: Colors.navy, borderColor: Colors.navy },
  chipText: { fontFamily: Fonts.heading, color: Colors.light.text },
  chipTextActive: { color: Colors.onPrimary },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
});
