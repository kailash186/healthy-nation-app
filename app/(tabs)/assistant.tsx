import { Send } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { askHealthAssistant, type ChatMessage } from '@/lib/ai';

const SUGGESTIONS = ['Headache and fever', 'Chest tightness', 'Shortness of breath', 'High blood sugar'];

const WELCOME: ChatMessage = {
  role: 'assistant',
  content:
    'Hi, I am your Healthy Nation assistant. Describe your symptoms and I will help you understand them. This is not a substitute for professional medical advice.',
};

export default function AssistantScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      const next: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
      setMessages(next);
      setInput('');
      setLoading(true);
      try {
        const reply = await askHealthAssistant(next);
        setMessages([...next, { role: 'assistant', content: reply }]);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Something went wrong.';
        setMessages([...next, { role: 'assistant', content: `Sorry, I could not respond: ${message}` }]);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages],
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(_, index) => String(index)}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
            <Text style={item.role === 'user' ? styles.userText : styles.assistantText}>{item.content}</Text>
          </View>
        )}
        ListFooterComponent={
          loading ? (
            <View style={[styles.bubble, styles.assistantBubble]}>
              <ActivityIndicator color={Colors.primary} />
            </View>
          ) : null
        }
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chips}
      >
        {SUGGESTIONS.map((suggestion) => (
          <Pressable key={suggestion} style={styles.chip} onPress={() => send(suggestion)}>
            <Text style={styles.chipText}>{suggestion}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={[styles.inputRow, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Describe your symptoms…"
          placeholderTextColor={Colors.light.textSecondary}
          onSubmitEditing={() => send(input)}
          returnKeyType="send"
          editable={!loading}
        />
        <Pressable style={styles.sendButton} onPress={() => send(input)} disabled={loading}>
          <Send color={Colors.onPrimary} size={18} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, gap: 10 },
  bubble: { maxWidth: '85%', borderRadius: 16, padding: 12 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: Colors.navy },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  userText: { fontFamily: Fonts.body, color: Colors.onPrimary },
  assistantText: { fontFamily: Fonts.body, color: Colors.light.text },
  chipsScroll: { flexGrow: 0 },
  chips: { paddingHorizontal: 16, paddingVertical: 8, gap: 8, alignItems: 'center' },
  chip: {
    backgroundColor: Colors.seafoamTint,
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: { fontFamily: Fonts.body, color: Colors.primaryDark, fontSize: 13 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  input: { fontFamily: Fonts.body,
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.light.text,
  },
  sendButton: { backgroundColor: Colors.primary, borderRadius: 999, padding: 12 },
});
