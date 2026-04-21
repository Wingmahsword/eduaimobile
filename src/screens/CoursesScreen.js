import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Linking, Modal, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import GlassCard from '../components/GlassCard';
import ScalePressable from '../components/ScalePressable';
import { colors, spacing, radius, typography } from '../constants/theme';
import { CATEGORIES } from '../constants/data';
import { useApp } from '../context/AppContext';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - spacing.lg * 2 - spacing.sm) / 2;

const GRID_GRADIENTS = [
  ['#06B6D4','#7C3AED'],['#EC4899','#F59E0B'],['#10B981','#06B6D4'],
  ['#8B5CF6','#EC4899'],['#F59E0B','#EF4444'],['#FF3B6B','#7C3AED'],
];

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
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 240 }}
        style={styles.header}
      >
        <Text style={styles.title}>Explore</Text>
        <GlassCard radiusSize={radius.md} style={styles.searchWrap}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search courses, instructors…"
            placeholderTextColor={colors.textMuted}
            style={styles.search}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={17} color={colors.textMuted} />
            </Pressable>
          )}
        </GlassCard>
      </MotiView>

      {/* Category chips */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(i) => i}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        renderItem={({ item }) => {
          const active = item === category;
          return (
            <ScalePressable onPress={() => setCategory(item)} scaleDown={0.92}>
              <MotiView
                animate={{ backgroundColor: active ? '#ffffff' : 'rgba(255,255,255,0.07)' }}
                transition={{ type: 'timing', duration: 220 }}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
              </MotiView>
            </ScalePressable>
          );
        }}
      />

      {/* 2-column grid */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item, index }) => {
          const grad = GRID_GRADIENTS[index % GRID_GRADIENTS.length];
          return (
            <MotiView
              from={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 16, stiffness: 220, delay: (index % 10) * 30 }}
            >
              <ScalePressable onPress={() => setSelected(item)} scaleDown={0.94} style={styles.gridCard}>
                <LinearGradient colors={[grad[0] + '44', grad[1] + '55']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gridCover}>
                  <View style={styles.gridCoverTop}>
                    <View style={[styles.levelBadge, { borderColor: grad[1] + '88' }]}>
                      <Text style={styles.levelText}>{item.level}</Text>
                    </View>
                    {item.enrolled && <Ionicons name="checkmark-circle" size={18} color="#10B981" />}
                  </View>
                  <Text style={styles.gridCategory}>{item.category}</Text>
                </LinearGradient>
                <View style={styles.gridInfo}>
                  <Text style={styles.gridTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.gridMeta} numberOfLines={1}>{item.instructor}</Text>
                  <View style={styles.gridFooter}>
                    <Text style={styles.gridPrice}>₹{item.price}</Text>
                    <View style={[styles.enrollDot, { backgroundColor: item.enrolled ? '#10B981' : grad[0] }]} />
                  </View>
                </View>
              </ScalePressable>
            </MotiView>
          );
        }}
      />

      {/* Detail modal */}
      <Modal visible={!!selected} animationType="slide" transparent onRequestClose={() => setSelected(null)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={() => setSelected(null)} />
          <MotiView
            from={{ translateY: 500 }}
            animate={{ translateY: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            style={styles.sheet}
          >
            {selected && (
              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                <View style={styles.handle} />
                <LinearGradient
                  colors={[GRID_GRADIENTS[0][0] + '44', GRID_GRADIENTS[0][1] + '55']}
                  style={styles.sheetBanner}
                >
                  <Text style={styles.sheetBannerText}>{selected.category}</Text>
                </LinearGradient>
                <View style={styles.sheetBody}>
                  <Text style={styles.sheetTitle}>{selected.title}</Text>
                  <Text style={styles.sheetInstructor}>{selected.instructor}</Text>
                  <View style={styles.metaRow}>
                    {[selected.level, selected.duration, `₹${selected.price}`].map((v) => (
                      <View key={v} style={styles.metaChip}><Text style={styles.metaText}>{v}</Text></View>
                    ))}
                  </View>
                  <Text style={styles.sheetDesc}>{selected.description}</Text>
                  <Text style={styles.sheetNote}>DAIR.AI · Mentor Board · Hiring Partners</Text>
                  <View style={styles.sheetActions}>
                    <ScalePressable onPress={() => Linking.openURL(selected.url)} style={styles.watchBtn} scaleDown={0.94}>
                      <Ionicons name="logo-youtube" size={17} color="#fff" />
                      <Text style={styles.actionText}>Watch Free</Text>
                    </ScalePressable>
                    <ScalePressable
                      onPress={() => enrollCourse(selected.id)}
                      style={[styles.enrollBtn, selected.enrolled && styles.enrolledBtn]}
                      scaleDown={0.94}
                    >
                      <Ionicons name={selected.enrolled ? 'checkmark' : 'flash'} size={17} color={selected.enrolled ? '#10B981' : '#000'} />
                      <Text style={[styles.actionText, { color: selected.enrolled ? '#10B981' : '#000' }]}>
                        {selected.enrolled ? 'Enrolled' : `Enroll · ₹${selected.price}`}
                      </Text>
                    </ScalePressable>
                  </View>
                </View>
              </ScrollView>
            )}
          </MotiView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.sm },
  title: { color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: -1.2, marginBottom: 12, fontFamily: typography.family },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: 11 },
  search: { flex: 1, color: '#fff', fontSize: 14, outlineStyle: 'none' },

  chipRow: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' },
  chipActive: { borderColor: 'transparent' },
  chipText: { color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: '700' },
  chipTextActive: { color: '#000', fontWeight: '800' },

  grid: { paddingHorizontal: spacing.lg, paddingBottom: 130, gap: spacing.sm },
  gridRow: { gap: spacing.sm },
  gridCard: { width: CARD_W, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#111', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  gridCover: { height: 110, padding: spacing.sm, justifyContent: 'space-between' },
  gridCoverTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  levelText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  gridCategory: { color: 'rgba(255,255,255,0.9)', fontWeight: '800', fontSize: 10, letterSpacing: 1.5 },
  gridInfo: { padding: 10 },
  gridTitle: { color: '#fff', fontWeight: '700', fontSize: 12, lineHeight: 16, marginBottom: 3 },
  gridMeta: { color: 'rgba(255,255,255,0.45)', fontSize: 10, marginBottom: 8 },
  gridFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gridPrice: { color: colors.accentSerif, fontWeight: '800', fontSize: 13 },
  enrollDot: { width: 8, height: 8, borderRadius: 4 },

  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  sheet: { backgroundColor: '#0e0e0e', borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '92%', borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.18)', marginTop: 12, marginBottom: 4 },
  sheetBanner: { height: 120, justifyContent: 'flex-end', padding: 18 },
  sheetBannerText: { color: 'rgba(255,255,255,0.7)', fontWeight: '800', letterSpacing: 2, fontSize: 11 },
  sheetBody: { padding: spacing.xl },
  sheetTitle: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: -0.5, lineHeight: 26 },
  sheetInstructor: { color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 13 },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  metaChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.07)' },
  metaText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  sheetDesc: { color: 'rgba(255,255,255,0.6)', marginTop: 16, lineHeight: 20, fontSize: 13 },
  sheetNote: { color: 'rgba(255,255,255,0.3)', marginTop: 14, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  sheetActions: { flexDirection: 'row', gap: 12, marginTop: 22, marginBottom: spacing.xl },
  watchBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  enrollBtn: { flex: 1.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: radius.md, backgroundColor: '#ffffff' },
  enrolledBtn: { backgroundColor: 'rgba(16,185,129,0.15)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.4)' },
  actionText: { fontWeight: '800', fontSize: 13, letterSpacing: 0.3, color: '#fff' },
});
