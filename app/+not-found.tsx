import { Link, Stack } from 'expo-router';
import { Compass } from 'lucide-react-native';

import { Button, Card, EmptyState, Screen } from '@/components/ui';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <Screen maxWidth={600}>
        <Card>
          <EmptyState icon={Compass} title="We couldn’t find that page" message="The link may be old or mistyped. Head back to the dashboard to pick up where you left off." />
          <Link href="/" asChild>
            <Button label="Go to dashboard" variant="secondary" style={{ alignSelf: 'center' }} />
          </Link>
        </Card>
      </Screen>
    </>
  );
}
