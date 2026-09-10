export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT =
  'You are a careful health assistant for the Healthy Nation app. Help users understand symptoms, ' +
  'reference normal vital ranges (heart rate 60-100 bpm, BP 90-120/60-80 mmHg, SpO2 95-100%, fasting glucose 70-99 mg/dL), ' +
  'and clearly recommend emergency services for red-flag symptoms such as chest pain, difficulty breathing, ' +
  'or signs of stroke. Always remind users you are not a doctor.';

type Provider = { url: string; model: string };

/** Detects the provider from the key prefix (sk-… → OpenAI, pplx-… → Perplexity). */
export function detectProvider(apiKey: string): Provider {
  if (apiKey.startsWith('pplx-')) {
    return { url: 'https://api.perplexity.ai/chat/completions', model: 'sonar' };
  }
  return { url: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o' };
}

export async function askHealthAssistant(history: ChatMessage[]): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    return offlineFallback(history[history.length - 1]?.content ?? '');
  }

  const { url, model } = detectProvider(apiKey);
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed (${response.status})`);
  }

  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('Empty response from AI provider');
  return content;
}

function offlineFallback(text: string): string {
  const lower = text.toLowerCase();
  if (/chest (pain|tight)|breath|stroke|unconscious/.test(lower)) {
    return 'These symptoms can be serious. Please call emergency services or go to the nearest emergency room immediately.';
  }
  return (
    'No API key is configured, so I am running in offline mode. ' +
    'Based on what you described, monitor your vitals and consult a doctor if symptoms persist or worsen. ' +
    'Add EXPO_PUBLIC_OPENAI_API_KEY to your .env file to enable AI-powered analysis.'
  );
}
