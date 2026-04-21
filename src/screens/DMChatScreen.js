import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, radius } from '../constants/theme';

const DEMO_MESSAGES = [
  { id: 'm1', fromMe: false, text: 'Yo! saw your latest AI reel 🔥' },
  { id: 'm2', fromMe: true, text: 'Thanks! Working on part 2 now.' },
  { id: 'm3', fromMe: false, text: 'Send it when done, I will repost.' },
  { id: 'm4', fromMe: true, text: 'Deal 🤝' },
];

function Bubble({ item }) {
  return (
    <View style={[styles.bubbleRow, item.fromMe ? styles.meRow : styles.themRow]}>
      <View style={[styles.bubble, item.fromMe ? styles.meBubble : styles.themBubble]}>
        <Text style={[styles.bubbleText, item.fromMe && styles.meText]}>{item.text}</Text>
      </View>
    </View>
  );
}

export default function DMChatScreen({ navigation, route }) {
  const thread = route?.params?.thread;
  const name = thread?.name || 'chat';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <LinearGradient colors={['#06B6D4', '#8B5CF6']} style={styles.avatar}>
          <Text style={styles.avatarText}>{name[0].toUpperCase()}</Text>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.status}>Active now</Text>
        </View>
        <Ionicons name="call-outline" size={20} color="#fff" />
      </View>

      <FlatList
        data={DEMO_MESSAGES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Bubble item={item} />}
        contentContainerStyle={styles.chatContent}
      />

      <View style={styles.composerWrap}>
        <View style={styles.composer}>
          <Ionicons name="happy-outline" size={20} color="rgba(255,255,255,0.6)" />
          <TextInput placeholder="Message..." placeholderTextColor="rgba(255,255,255,0.4)" style={styles.input} />
          <Ionicons name="mic-outline" size={20} color="rgba(255,255,255,0.6)" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.14)',
  },
  avatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 13 },
  name: { color: '#fff', fontSize: 15, fontWeight: '700' },
  status: { color: 'rgba(255,255,255,0.45)', fontSize: 11 },
  chatContent: { paddingHorizontal: spacing.md, paddingVertical: 14, gap: 10 },
  bubbleRow: { flexDirection: 'row' },
  meRow: { justifyContent: 'flex-end' },
  themRow: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '78%', borderRadius: radius.lg, paddingHorizontal: 12, paddingVertical: 10 },
  meBubble: { backgroundColor: '#EC4899' },
  themBubble: { backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  bubbleText: { color: '#fff', fontSize: 13, lineHeight: 18 },
  meText: { color: '#fff' },
  composerWrap: { paddingHorizontal: spacing.md, paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.12)' },
  composer: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 14, paddingVertical: 10 },
  input: { flex: 1, color: '#fff', fontSize: 14, paddingVertical: 0, outlineStyle: 'none' },
});
