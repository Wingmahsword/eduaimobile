import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { MotiView } from 'moti';
import ScalePressable from '../components/ScalePressable';
import { colors, spacing, radius, typography } from '../constants/theme';
import { MODELS, API_BASE } from '../constants/data';
import { useApp } from '../context/AppContext';

const STARTERS = [
  'Explain gradient descent visually',
  'What is the attention mechanism?',
  'How does RAG work in production?',
  'Compare CNNs vs Transformers',
];

function TypingDots({ color }) {
  return (
    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <MotiView
          key={i}
          from={{ opacity: 0.25, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 200, loop: true, delay: i * 160 }}
          style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: color }}
        />
      ))}
    </View>
  );
}

function SendButton({ onPress, disabled, color }) {
  const sv = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: sv.value }] }));
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { sv.value = withSpring(0.85, { damping: 12, stiffness: 500 }); }}
      onPressOut={() => { sv.value = withSpring(1, { damping: 10, stiffness: 300 }); }}
      disabled={disabled}
    >
      <Animated.View style={[styles.sendBtn, { backgroundColor: disabled ? 'rgba(255,255,255,0.15)' : color }, aStyle]}>
        <Ionicons name="arrow-up" size={20} color="#fff" />
      </Animated.View>
    </Pressable>
  );
}

export default function PlaygroundScreen() {
  const { messages, sendMessage } = useApp();
  const [model, setModel] = useState(MODELS[0]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [aiReady, setAiReady] = useState(null); // null=checking, true=ready, false=warming/error
  const scrollRef = useRef(null);

  const visible = messages.filter((m) => m.role !== 'thinking');
  const thinking = messages.some((m) => m.role === 'thinking');

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    let alive = true;
    async function checkAiHealth() {
      try {
        const res = await fetch(`${API_BASE}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'openai/gpt-oss-120b:free',
            messages: [{ role: 'user', content: 'ping' }],
            stream: false,
          }),
        });
        if (alive) setAiReady(res.ok || res.status === 429);
      } catch {
        if (alive) setAiReady(false);
      }
    }
    checkAiHealth();
    return () => { alive = false; };
  }, []);

  const send = async (override) => {
    const value = (override ?? text).trim();
    if (!value || sending || aiReady === false) return;
    setText('');
    setSending(true);
    await sendMessage(value, model.id);
    setSending(false);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header — Instagram DM style */}
      <MotiView
        from={{ opacity: 0, translateY: -12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 240 }}
        style={styles.header}
      >
        <View style={[styles.modelAvatar, { backgroundColor: model.color + '33', borderColor: model.color + '66' }]}>
          <View style={[styles.modelAvatarDot, { backgroundColor: model.color }]} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerName}>{model.name}</Text>
          <Text style={styles.headerSub}>{model.org} · AI model</Text>
        </View>
        <FlatList
          horizontal
          data={MODELS}
          keyExtractor={(m) => m.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => {
            const active = item.id === model.id;
            return (
              <ScalePressable onPress={() => setModel(item)} scaleDown={0.88}>
                <MotiView
                  animate={{ scale: active ? 1 : 0.95, opacity: active ? 1 : 0.55 }}
                  transition={{ type: 'spring', damping: 14 }}
                  style={[styles.modelPip, { borderColor: item.color, backgroundColor: active ? item.color + '28' : 'transparent' }]}
                >
                  <View style={[styles.pipDot, { backgroundColor: item.color }]} />
                </MotiView>
              </ScalePressable>
            );
          }}
        />
      </MotiView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={8}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.chatArea}
          showsVerticalScrollIndicator={false}
        >
          {aiReady === false && (
            <View style={styles.warmupBanner}>
              <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.warmupText}>AI is warming up...</Text>
            </View>
          )}

          {/* Welcome state */}
          {visible.length <= 1 && (
            <MotiView
              from={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 16, stiffness: 200 }}
              style={styles.welcomeCard}
            >
              <LinearGradient
                colors={[model.color + '22', model.color + '08']}
                style={styles.welcomeGrad}
              >
                <View style={[styles.welcomeAvatar, { backgroundColor: model.color + '30', borderColor: model.color + '60' }]}>
                  <Ionicons name={model.icon || 'sparkles'} size={28} color={model.color} />
                </View>
                <Text style={styles.welcomeTitle}>{model.name}</Text>
                {model.tag && (
                  <View style={[styles.tagChip, { borderColor: model.color + '55', backgroundColor: model.color + '1a' }]}>
                    <Text style={[styles.tagText, { color: model.color }]}>{model.tag}</Text>
                  </View>
                )}
                <Text style={styles.welcomeSub}>
                  {model.description || `${model.org} · Ready to help`}
                </Text>
              </LinearGradient>
            </MotiView>
          )}

          {/* Starter prompts */}
          {visible.length <= 1 && (
            <View style={styles.starters}>
              <Text style={styles.starterLabel}>TRY ASKING</Text>
              {STARTERS.map((s, i) => (
                <MotiView
                  key={s}
                  from={{ opacity: 0, translateX: -16 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: 'spring', damping: 16, stiffness: 200, delay: 120 + i * 60 }}
                >
                  <ScalePressable onPress={() => send(s)} scaleDown={0.96}>
                    <View style={styles.starter}>
                      <Ionicons name="arrow-forward-circle-outline" size={16} color={model.color} />
                      <Text style={styles.starterText}>{s}</Text>
                    </View>
                  </ScalePressable>
                </MotiView>
              ))}
            </View>
          )}

          {/* Messages */}
          {visible.map((m, i) => (
            <MotiView
              key={i}
              from={{ opacity: 0, translateY: 12, scale: 0.96 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 18, stiffness: 280 }}
              style={[styles.msgRow, m.role === 'user' ? styles.msgRowUser : styles.msgRowAI]}
            >
              {m.role !== 'user' && (
                <View style={[styles.aiBubbleAvatar, { backgroundColor: model.color + '22', borderColor: model.color + '44' }]}>
                  <View style={[styles.pipDot, { backgroundColor: model.color }]} />
                </View>
              )}
              <View style={[
                styles.bubble,
                m.role === 'user'
                  ? [styles.userBubble, { backgroundColor: model.color + '28', borderColor: model.color + '55' }]
                  : styles.aiBubble,
                m.error && { borderColor: 'rgba(244,114,182,0.45)' },
              ]}>
                <Text style={styles.bubbleText}>
                  {m.content}
                  {m.role === 'assistant' && m.streaming && (
                    <Text style={{ color: model.color }}> ▋</Text>
                  )}
                </Text>
              </View>
            </MotiView>
          ))}

          {/* Thinking indicator — only when assistant is streaming with no content yet */}
          {visible.some((m) => m.role === 'assistant' && m.streaming && !m.content) && (
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 14 }}
              style={styles.msgRow}
            >
              <View style={[styles.aiBubbleAvatar, { backgroundColor: model.color + '22', borderColor: model.color + '44' }]}>
                <View style={[styles.pipDot, { backgroundColor: model.color }]} />
              </View>
              <View style={styles.aiBubble}>
                <TypingDots color={model.color} />
              </View>
            </MotiView>
          )}
        </ScrollView>

        {/* Input bar */}
        <View style={styles.inputWrap}>
          <View style={styles.inputBar}>
            <TextInput
              value={text}
              onChangeText={setText}
              editable={aiReady !== false}
              placeholder={`Message ${model.name}…`}
              placeholderTextColor="rgba(255,255,255,0.3)"
              style={styles.input}
              multiline
              maxLength={2000}
            />
            <SendButton onPress={() => send()} disabled={sending || !text.trim() || aiReady === false} color={model.color} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.lg, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.1)' },
  modelAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  modelAvatarDot: { width: 14, height: 14, borderRadius: 7 },
  headerName: { color: '#fff', fontWeight: '700', fontSize: 15, fontFamily: typography.family },
  headerSub: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 1 },
  modelPip: { width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  pipDot: { width: 10, height: 10, borderRadius: 5 },

  chatArea: { padding: spacing.lg, gap: 12, paddingBottom: 120 },

  warmupBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 7,
    marginBottom: 4,
  },
  warmupText: { color: 'rgba(255,255,255,0.82)', fontSize: 12, fontWeight: '600' },

  welcomeCard: { alignSelf: 'center', width: '80%', marginBottom: 8 },
  welcomeGrad: { borderRadius: radius.xl, padding: 24, alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  welcomeAvatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  welcomeTitle: { color: '#fff', fontSize: 18, fontWeight: '800', fontFamily: typography.family },
  tagChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, marginTop: 2 },
  tagText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  welcomeSub: { color: 'rgba(255,255,255,0.55)', fontSize: 12, textAlign: 'center' },

  starters: { gap: 8, marginBottom: 8 },
  starterLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 4 },
  starter: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: radius.lg, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)' },
  starterText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, flex: 1 },

  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowAI: { justifyContent: 'flex-start' },
  aiBubbleAvatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  bubble: { maxWidth: '82%', borderRadius: 18, padding: 13, borderWidth: 1 },
  userBubble: { borderBottomRightRadius: 4 },
  aiBubble: { borderBottomLeftRadius: 4, backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.1)' },
  bubbleText: { color: '#fff', fontSize: 14, lineHeight: 21 },

  inputWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 12, paddingBottom: Platform.OS === 'ios' ? 90 : 82, paddingTop: 8 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, backgroundColor: '#111', borderRadius: 26, paddingLeft: 18, paddingRight: 6, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  input: { flex: 1, maxHeight: 120, color: '#fff', fontSize: 15, paddingTop: 8, paddingBottom: 8, outlineStyle: 'none', lineHeight: 20 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});
