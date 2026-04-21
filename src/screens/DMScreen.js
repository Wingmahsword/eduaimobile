import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, radius } from '../constants/theme';

const THREADS = [
  { id: 'dm1', name: 'krish_ai', last: 'Bro check this ML roadmap reel', time: '2m', unread: 2 },
  { id: 'dm2', name: 'anna.ml', last: 'Shared a CS229 note PDF', time: '8m', unread: 0 },
  { id: 'dm3', name: 'micro_ai', last: 'Let\'s collab on your reel draft', time: '21m', unread: 1 },
  { id: 'dm4', name: 'hf_user', last: 'Tokenizer bug fixed ✅', time: '1h', unread: 0 },
  { id: 'dm5', name: 'su_dev', last: 'Drop your project link', time: '3h', unread: 0 },
];

function ThreadItem({ item }) {
  return (
    <View style={styles.threadRow}>
      <LinearGradient colors={['#06B6D4', '#8B5CF6']} style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name[0].toUpperCase()}</Text>
      </LinearGradient>
      <View style={styles.threadMeta}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.last} numberOfLines={1}>{item.last}</Text>
      </View>
      <View style={styles.rightMeta}>
        <Text style={styles.time}>{item.time}</Text>
        {!!item.unread && (
          <View style={styles.unreadPill}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function DMScreen() {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Ionicons name="create-outline" size={22} color="#fff" />
      </View>
      <FlatList
        data={THREADS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ThreadItem item={item} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.14)',
  },
  title: { color: '#fff', fontSize: 23, fontWeight: '800' },
  listContent: { paddingVertical: 6 },
  threadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    gap: 12,
  },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  threadMeta: { flex: 1, gap: 2 },
  name: { color: '#fff', fontWeight: '700', fontSize: 14 },
  last: { color: 'rgba(255,255,255,0.56)', fontSize: 12, maxWidth: '96%' },
  rightMeta: { alignItems: 'flex-end', gap: 8, minWidth: 40 },
  time: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
  unreadPill: {
    minWidth: 20,
    height: 20,
    borderRadius: radius.pill,
    backgroundColor: '#EC4899',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { color: '#fff', fontWeight: '800', fontSize: 11 },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.08)', marginLeft: 74 },
});
