import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { DetailSection, DetailShell, Field, NotFound } from '@/components/DetailShell';
import { Badge, ListRow, Text } from '@/components/ui';
import { useHealthData } from '@/lib/data/store';
import { personById } from '@/lib/data/selectors';
import { formatWhen, RECORD_KIND_LABEL } from '@/lib/format';

const TONE = { urgent: 'danger', attention: 'warning', info: 'primary' } as const;
const LABEL = { urgent: 'Urgent', attention: 'Needs attention', info: 'For your information' } as const;

export default function UpdateDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, markUpdateRead } = useHealthData();
  const update = data.updates.find((u) => u.id === id);

  useEffect(() => {
    if (update && !update.readAt) markUpdateRead(update.id);
  }, [update, markUpdateRead]);

  if (!update) return <NotFound what="update" onBack={() => router.back()} />;
  const person = personById(data, update.personId);
  const record = data.records.find((r) => r.id === update.linkedRecordId);

  return (
    <DetailShell eyebrow={update.source ?? 'Update'} title={update.title} subtitle={formatWhen(update.createdAt)}>
      <Badge label={LABEL[update.severity]} tone={TONE[update.severity]} />
      <DetailSection title="Message">
        <Text>{update.body}</Text>
      </DetailSection>
      <DetailSection title="Details">
        <Field label="About" value={person?.name} />
        <Field label="From" value={update.source} />
      </DetailSection>
      {record && (
        <DetailSection title="Linked record">
          <ListRow title={record.title} subtitle={RECORD_KIND_LABEL[record.kind]} onPress={() => router.push({ pathname: '/records/[id]', params: { id: record.id } })} />
        </DetailSection>
      )}
    </DetailShell>
  );
}
