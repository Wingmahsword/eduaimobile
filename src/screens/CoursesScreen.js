import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Linking, Modal, ScrollView, Image, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import GlassCard from '../components/GlassCard';
import { colors, spacing, radius, typography } from '../constants/theme';
import { CATEGORIES } from '../constants/data';
import { useApp } from '../context/AppContext';

export default function CoursesScreen() {
  const { courses, enrollCourse } = useApp();
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      const matchCat = category === 'All' || c.category === category;
      const matchQ = !q || c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [courses, category, query]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <LinearGradient
        colors={["#050505", "#0B0216"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <Text style={styles.kicker}>NEURAL REGISTRY</Text>
        <Text style={styles.title}>All Courses</Text>
      </View>

      <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md }}>
        <GlassCard radiusSize={radius.md} style={styles.searchWrap}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by title or instructor"
            placeholderTextColor={colors.textMuted}
            style={styles.search}
          />
        </GlassCard>
      </View>

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(i) => i}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm, paddingVertical: spacing.md }}
        renderItem={({ item }) => {
          const active = item === category;
          return (
            <Pressable onPress={() => setCategory(item)}>
              <MotiView
                animate={{ scale: active ? 1.04 : 1 }}
                transition={{ type: 'timing', duration: 360, easing: Easing.inOut(Easing.cubic) }}
              >
                <GlassCard
                  radiusSize={radius.pill}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                </GlassCard>
              </MotiView>
            </Pressable>
          );
        }}
      />

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140, gap: spacing.md }}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 420, delay: index * 35, easing: Easing.inOut(Easing.cubic) }}
          >
            <Pressable onPress={() => setSelected(item)}>
              <GlassCard radiusSize={radius.xl} style={styles.card}>
                <LinearGradient
                  colors={["rgba(6,182,212,0.24)", "rgba(236,72,153,0.24)", "rgba(0,255,65,0.08)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cover}
                >
                  <View style={styles.coverTop}>
                    <View style={styles.playPill}>
                      <Ionicons name="play" size={12} color="#fff" />
                      <Text style={styles.playText}>PREVIEW</Text>
                    </View>
                    <Text style={styles.levelChip}>{item.level}</Text>
                  </View>
                  <Text style={styles.coverTag}>{item.category.toUpperCase()}</Text>
                </LinearGradient>
                <View style={{ padding: spacing.md }}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.cardMeta}>{item.instructor} · {item.duration}</Text>
                  <View style={styles.cardRow}>
                    <Text style={styles.price}>₹{item.price}</Text>
                    <View style={{ flex: 1 }} />
                    <View style={[styles.enrollPill, item.enrolled && { backgroundColor: 'rgba(16,185,129,0.22)', borderColor: 'rgba(16,185,129,0.45)' }]}>
                      <Ionicons name={item.enrolled ? 'checkmark' : 'flash'} size={12} color="#fff" />
                      <Text style={styles.enrollText}>{item.enrolled ? 'ENROLLED' : 'ENROLL'}</Text>
                    </View>
                  </View>
                </View>
              </GlassCard>
            </Pressable>
          </MotiView>
        )}
      />

      <Modal visible={!!selected} animationType="slide" transparent onRequestClose={() => setSelected(null)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={() => setSelected(null)} />
          <MotiView
            from={{ translateY: 400 }}
            animate={{ translateY: 0 }}
            transition={{ type: 'spring', damping: 18 }}
          >
            <GlassCard radiusSize={radius.xxl} bordered={false} style={styles.sheet}>
              {selected && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.handle} />

                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800' }}
                    style={styles.sheetImage}
                  />

                  <Text style={styles.sheetKicker}>{selected.category.toUpperCase()}</Text>
                  <Text style={styles.sheetTitle}>{selected.title}</Text>
                  <Text style={styles.sheetInstructor}>{selected.instructor}</Text>

                  <View style={styles.sheetMetaRow}>
                    <View style={styles.metaChip}><Text style={styles.metaText}>{selected.level}</Text></View>
                    <View style={styles.metaChip}><Text style={styles.metaText}>{selected.duration}</Text></View>
                    <View style={[styles.metaChip, { backgroundColor: 'rgba(0,255,65,0.14)', borderColor: 'rgba(0,255,65,0.5)' }]}>
                      <Text style={[styles.metaText, { color: colors.text }]}>₹{selected.price}</Text>
                    </View>
                  </View>

                  <Text style={styles.sheetBody}>{selected.description}</Text>

                  <Text style={styles.sheetSubtle}>Supported by DAIR.AI · Mentor Board · Hiring Partner Network</Text>

                  <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg, marginBottom: spacing.xl }}>
                    <Pressable style={[styles.actionBtn, styles.actionSecondary]} onPress={() => Linking.openURL(selected.url)}>
                      <Ionicons name="logo-youtube" size={16} color="#fff" />
                      <Text style={styles.actionText}>Watch</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.actionBtn, selected.enrolled ? styles.actionEnrolled : styles.actionPrimary]}
                      onPress={() => enrollCourse(selected.id)}
                    >
                      <Ionicons name={selected.enrolled ? 'checkmark' : 'flash'} size={16} color="#fff" />
                      <Text style={styles.actionText}>{selected.enrolled ? 'ENROLLED' : `ENROLL · ₹${selected.price}`}</Text>
                    </Pressable>
                  </View>
                </ScrollView>
              )}
            </GlassCard>
          </MotiView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  kicker: { color: colors.accent, fontSize: 10, letterSpacing: 3, fontWeight: '800' },
  title: { color: colors.text, fontSize: 28, fontWeight: typography.heavy, marginTop: 4, letterSpacing: -1.2, fontFamily: typography.family },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: 10 },
  search: { flex: 1, color: colors.text, outlineStyle: 'none' },
  chip: { paddingHorizontal: 14, paddingVertical: 9 },
  chipActive: { backgroundColor: 'rgba(0,255,65,0.12)', borderColor: 'rgba(0,255,65,0.45)' },
  chipText: { color: colors.textDim, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  chipTextActive: { color: colors.accent, fontFamily: typography.family },
  card: { overflow: 'hidden' },
  cover: { height: 140, padding: spacing.md, justifyContent: 'space-between' },
  coverTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  playPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.08)' },
  playText: { color: '#fff', fontSize: 9, letterSpacing: 1.5, fontWeight: '900' },
  levelChip: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1.2, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.3)' },
  coverTag: { color: '#fff', fontWeight: '900', letterSpacing: 2, fontSize: 11 },
  cardTitle: { color: colors.text, fontWeight: '800', fontSize: 16, marginBottom: 4 },
  cardMeta: { color: colors.textDim, fontSize: 12 },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, gap: spacing.sm },
  price: { color: colors.accentSerif, fontWeight: '800', fontSize: 16 },
  enrollPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: colors.accent, borderWidth: 1, borderColor: 'transparent' },
  enrollText: { color: '#fff', fontSize: 10, letterSpacing: 1.5, fontWeight: '900' },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.65)' },
  sheet: { padding: spacing.xl, maxHeight: '90%', backgroundColor: 'rgba(5,5,5,0.96)' },
  handle: { alignSelf: 'center', width: 48, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: spacing.md },
  sheetImage: { width: '100%', height: 160, borderRadius: radius.lg, marginBottom: spacing.lg, backgroundColor: '#222' },
  sheetKicker: { color: colors.accent, fontSize: 10, letterSpacing: 3, fontWeight: '800' },
  sheetTitle: { color: colors.text, fontSize: 24, fontWeight: '900', marginTop: 4, letterSpacing: -0.3 },
  sheetInstructor: { color: colors.textDim, marginTop: 4 },
  sheetMetaRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
  metaChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.08)' },
  metaText: { color: colors.text, fontSize: 11, fontWeight: '700' },
  sheetBody: { color: colors.textDim, marginTop: spacing.lg, lineHeight: 20 },
  sheetSubtle: { color: colors.textMuted, marginTop: spacing.lg, fontSize: 11, letterSpacing: 1.2, fontWeight: '700' },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: radius.md },
  actionPrimary: { backgroundColor: colors.accent },
  actionEnrolled: { backgroundColor: 'rgba(16,185,129,0.26)' },
  actionSecondary: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: colors.border },
  actionText: { color: '#fff', fontWeight: '800', letterSpacing: 1.2, fontSize: 12 },
});
