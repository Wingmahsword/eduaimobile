import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, FlatList, KeyboardAvoidingView, Platform, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import GlassCard from '../components/GlassCard';
import { colors, spacing, radius, typography } from '../constants/theme';
import { MODELS } from '../constants/data';
import { useApp } from '../context/AppContext';

const STARTERS = [
  'Explain gradient descent visually',
  'What is the attention mechanism?',
  'How does RAG work in production?',
  'Compare CNNs vs Transformers',
];

function TypingDots({ color }) {
  return (
    <View style={{ flexDirection: 'row', gap: 5, paddingVertical: 2 }}>
      {[0, 1, 2].map((i) => (
        <MotiView
          key={i}
          from={{ opacity: 0.3, translateY: 0 }}
          animate={{ opacity: 1, translateY: -3 }}
          transition={{ type: 'timing', duration: 620, loop: true, delay: i * 140, easing: Easing.inOut(Easing.ease) }}
          style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }}
        />
      ))}
    </View>
  );
}

export default function PlaygroundScreen() {
  const { messages, sendMessage } = useApp();
  const [model, setModel] = useState(MODELS[0]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  const visible = messages.filter((m) => m.role !== 'thinking');
  const thinking = messages.some((m) => m.role === 'thinking');

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const send = async (override) => {
    const value = (override ?? text).trim();
    if (!value || sending) return;
    setText('');
    setSending(true);
    await sendMessage(value, model.id);
    setSending(false);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <LinearGradient colors={["#050505", "#0B0216"]} style={StyleSheet.absoluteFill} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={8}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>AI SANDBOX · LIVE</Text>
            <Text style={styles.title}>Playground</Text>
          </View>
          <GlassCard radiusSize={radius.pill} style={styles.statusPill}>
            <View style={[styles.liveDot, { backgroundColor: model.color }]} />
            <Text style={styles.statusText}>{model.org}</Text>
          </GlassCard>
        </View>

        <FlatList
          horizontal
          data={MODELS}
          keyExtractor={(m) => m.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm, paddingVertical: spacing.md }}
          renderItem={({ item }) => {
            const active = item.id === model.id;
            return (
              <Pressable onPress={() => setModel(item)}>
                <MotiView
                  animate={{ scale: active ? 1.05 : 1 }}
                  transition={{ type: 'timing', duration: 360, easing: Easing.inOut(Easing.cubic) }}
                >
                  <GlassCard
                    radiusSize={radius.pill}
                    style={[
                      styles.modelChip,
                      active && { backgroundColor: item.color + '28', borderColor: item.color + '88' },
                    ]}
                  >
                    <View style={[styles.modelDot, { backgroundColor: item.color }]} />
                    <Text style={[styles.modelName, active && { color: '#fff' }]}>{item.name}</Text>
                  </GlassCard>
                </MotiView>
              </Pressable>
            );
          }}
        />

        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: 140 }}
        >
          {visible.map((m, i) => (
            <MotiView
              key={i}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 380, easing: Easing.inOut(Easing.cubic) }}
              style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}
            >
              {m.role === 'user' ? (
                <View style={[styles.bubble, { backgroundColor: model.color + '22', borderColor: model.color + '66' }]}> 
                  <Text style={styles.bubbleText}>{m.content}</Text>
                </View>
              ) : (
                <GlassCard radiusSize={radius.lg} style={styles.bubble}>
                  <Text style={styles.bubbleText}>{m.content}</Text>
                </GlassCard>
              )}
            </MotiView>
          ))}

          {thinking && (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'flex-start' }}>
              <GlassCard radiusSize={radius.lg} style={styles.bubble}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <TypingDots color={model.color} />
                  <Text style={styles.typing}>{model.name} is thinking…</Text>
                </View>
              </GlassCard>
            </MotiView>
          )}

          {visible.length <= 1 && (
            <View style={styles.starters}>
              {STARTERS.map((s, i) => (
                <MotiView
                  key={s}
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 420, delay: i * 70, easing: Easing.inOut(Easing.cubic) }}
                >
                  <Pressable onPress={() => send(s)}>
                    <GlassCard radiusSize={radius.md} style={styles.starter}>
                      <Ionicons name="sparkles-outline" size={12} color={colors.accentSerif} />
                      <Text style={styles.starterText}>{s}</Text>
                    </GlassCard>
                  </Pressable>
                </MotiView>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.inputWrap}>
          <GlassCard radiusSize={radius.xxl} style={styles.inputBar}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={`Ask ${model.name} anything…`}
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              multiline
              onSubmitEditing={() => send()}
            />
            <Pressable onPress={() => send()} style={[styles.sendBtn, sending && { opacity: 0.5 }, { backgroundColor: model.color }]} disabled={sending}>
              <Ionicons name="arrow-up" size={18} color="#fff" />
            </Pressable>
          </GlassCard>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  kicker: { color: colors.accent, fontSize: 10, letterSpacing: 3, fontWeight: '800' },
  title: { color: colors.text, fontSize: 28, fontWeight: typography.heavy, marginTop: 4, letterSpacing: -1.2, fontFamily: typography.family },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 7 },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { color: colors.text, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  modelChip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8 },
  modelDot: { width: 8, height: 8, borderRadius: 4 },
  modelName: { color: colors.textDim, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  bubble: { borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.05)' },
  bubbleText: { color: colors.text, lineHeight: 20, fontSize: 14 },
  typing: { color: colors.textDim, fontStyle: 'italic', fontSize: 12 },
  starters: { gap: spacing.sm, marginTop: spacing.sm },
  starter: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 12 },
  starterText: { color: colors.textDim, fontSize: 13 },
  inputWrap: { position: 'absolute', left: 12, right: 12, bottom: Platform.OS === 'ios' ? 94 : 86 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, padding: 6 },
  input: { flex: 1, maxHeight: 120, color: colors.text, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 12, outlineStyle: 'none' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
});
