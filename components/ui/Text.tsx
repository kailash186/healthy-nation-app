import { Text as RNText, StyleSheet, type TextProps } from 'react-native';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';

type Variant = 'display' | 'title' | 'heading' | 'subheading' | 'body' | 'caption' | 'label';
type Tone = 'default' | 'muted' | 'inverse' | 'primary' | 'danger' | 'warning';

interface Props extends TextProps {
  variant?: Variant;
  tone?: Tone;
}

export function Text({ variant = 'body', tone = 'default', style, ...rest }: Props) {
  return <RNText {...rest} style={[styles.base, variants[variant], tones[tone], style]} />;
}

const styles = StyleSheet.create({
  base: { fontFamily: Fonts.body, color: Colors.light.text },
});

const variants = StyleSheet.create({
  display: { fontFamily: Fonts.heading, fontSize: 30, lineHeight: 36, letterSpacing: -0.5 },
  title: { fontFamily: Fonts.heading, fontSize: 22, lineHeight: 28, letterSpacing: -0.3 },
  heading: { fontFamily: Fonts.heading, fontSize: 17, lineHeight: 22 },
  subheading: { fontFamily: Fonts.heading, fontSize: 15, lineHeight: 20 },
  body: { fontSize: 15, lineHeight: 22 },
  caption: { fontSize: 13, lineHeight: 18 },
  label: { fontFamily: Fonts.heading, fontSize: 12, lineHeight: 16, letterSpacing: 0.6, textTransform: 'uppercase' },
});

const tones = StyleSheet.create({
  default: {},
  muted: { color: Colors.light.textSecondary },
  inverse: { color: Colors.onPrimary },
  primary: { color: Colors.primary },
  danger: { color: Colors.status.error },
  warning: { color: '#8a5a12' },
});
