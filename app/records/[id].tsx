import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DetailSection, DetailShell, Field, NotFound } from '@/components/DetailShell';
import { Badge, ListRow, Text } from '@/components/ui';
import { Colors } from '@/constants/colors';
import { useHealthData } from '@/lib/data/store';
import { personById, providerById } from '@/lib/data/selectors';
import { formatDate, RECORD_KIND_LABEL } from '@/lib/format';

export default function RecordDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data } = useHealthData();
  const record = data.records.find((r) => r.id === id);
  if (!record) return <NotFound what="record" onBack={() => router.back()} />;

  const person = personById(data, record.personId);
  const provider = providerById(data, record.providerId);

  return (
    <DetailShell eyebrow={RECORD_KIND_LABEL[record.kind]} title={record.title} subtitle={formatDate(record.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}>
      {record.summary && (
        <DetailSection title="Summary">
          <Text>{record.summary}</Text>
        </DetailSection>
      )}

      {record.values && record.values.length > 0 && (
        <DetailSection title="Results">
          {record.values.map((v, i) => (
            <View key={v.label} style={[styles.valueRow, i < record.values!.length - 1 && styles.divider]}>
              <Text style={{ flex: 1 }}>{v.label}</Text>
              <Text variant="subheading">
                {v.value}
                {v.unit ? <Text variant="caption" tone="muted">{` ${v.unit}`}</Text> : null}
              </Text>
              {v.flag && v.flag !== 'normal' && <Badge label={v.flag === 'high' ? 'High' : 'Low'} tone="warning" />}
              {v.flag === 'normal' && <Badge label="Normal" tone="success" />}
            </View>
          ))}
          <Text variant="caption" tone="muted" style={styles.note}>
            Reference ranges vary by lab. Discuss flagged values with your provider.
          </Text>
        </DetailSection>
      )}

      <DetailSection title="Details">
        <Field label="For" value={person?.name} />
        {provider && <ListRow title={provider.name} subtitle={provider.organisation} onPress={() => router.push({ pathname: '/providers/[id]', params: { id: provider.id } })} />}
      </DetailSection>
    </DetailShell>
  );
}

const styles = StyleSheet.create({
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  divider: { borderBottomWidth: 1, borderBottomColor: Colors.light.border },
  note: { marginTop: 10 },
});
