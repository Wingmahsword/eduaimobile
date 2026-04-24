import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, TextInput,
  Linking, Modal, ScrollView, Dimensions, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import ScalePressable from '../components/ScalePressable';
import { CATEGORIES } from '../constants/data';
import { useApp } from '../context/AppContext';

const { width: SCREEN_W } = Dimensions.get('window');
const GUTTER = 14;
const CARD_W = (SCREEN_W - GUTTER * 3) / 2;
const IS_WEB = Platform.OS === 'web';

/* ─── Palette (violet / teal glass per spec) ─────────────────────── */
const T = {
  bg:          '#0a0a0f',
  glassBg:     'rgba(255,255,255,0.04)',
  glassBorder: 'rgba(255,255,255,0.08)',
  glassBorderH:'rgba(255,255,255,0.15)',
  accent:      '#7c6dfa',
  teal:        '#5eead4',
  glow:        'rgba(124,109,250,0.3)',
  text:        '#f0f0ff',
  textSub:     'rgba(240,240,255,0.55)',
  textMuted:   'rgba(240,240,255,0.30)',
};

/* Each category gets its own subtle hue in the violet↔teal range */
const CATEGORY_HUE = {
  'Machine Learning':   { accent: '#7c6dfa', tint: 'rgba(124,109,250,0.10)' },
  'Deep Learning':      { accent: '#a78bfa', tint: 'rgba(167,139,250,0.10)' },
  'Generative AI':      { accent: '#f472b6', tint: 'rgba(244,114,182,0.10)' },
  'Prompt Engineering': { accent: '#5eead4', tint: 'rgba(94,234,212,0.10)' },
  'AI Applications':    { accent: '#38bdf8', tint: 'rgba(56,189,248,0.10)' },
};
const hueFor = (cat) => CATEGORY_HUE[cat] || { accent: T.accent, tint: 'rgba(124,109,250,0.10)' };

/* ─── Glass primitive ────────────────────────────────────────────── */
function Glass({ style, intensity = 24, children }) {
  if (IS_WEB) {
    return (
      <View
        style={[
          {
            backgroundColor: T.glassBg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderColor: T.glassBorder,
            borderWidth: 1,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }
  return (
    <BlurView
      intensity={intensity}
      tint="dark"
      style={[{ borderColor: T.glassBorder, borderWidth: 1, overflow: 'hidden' }, style]}
    >
      {children}
    </BlurView>
  );
}

/* ─── Course card — glass minimal with hue accent ────────────────── */
function CourseCard({ item, onPress, index }) {
  const { accent, tint } = hueFor(item.category);
  return (
    <MotiView
      from={{ opacity: 0, translateY: 14 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 18, stiffness: 220, delay: (index % 10) * 28 }}
      style={{ width: CARD_W }}
    >
      <ScalePressable onPress={onPress} scaleDown={0.96} style={S.cardOuter}>
        <Glass style={S.card}>
          {/* Soft hue wash */}
          <LinearGradient
            colors={[tint, 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Accent stripe left */}
          <View style={[S.stripe, { backgroundColor: accent }]} />

          {/* Enrolled check */}
          {item.enrolled && (
            <View style={[S.enrolledMark, { backgroundColor: T.teal }]}>
              <Ionicons name="checkmark" size={10} color="#0a0a0f" />
            </View>
          )}

          <View style={S.cardInner}>
            <Text style={[S.cardCategory, { color: accent }]} numberOfLines={1}>
              {item.category.toUpperCase()}
            </Text>

            <Text style={S.cardTitle} numberOfLines={3}>{item.title}</Text>

            <Text style={S.cardInstructor} numberOfLines={1}>{item.instructor}</Text>

            <View style={S.cardDivider} />

            <View style={S.cardFooter}>
              <View style={[S.levelPill, { borderColor: accent + '55' }]}>
                <Text style={[S.levelText, { color: accent }]}>{item.level}</Text>
              </View>
              <Text style={S.price}>₹{item.price}</Text>
            </View>
          </View>
        </Glass>
      </ScalePressable>
    </MotiView>
  );
}

/* ─── Filter bottom sheet (popup) ────────────────────────────────── */
function FilterSheet({ visible, selected, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={S.modalRoot}>
        <Pressable style={S.backdrop} onPress={onClose} />
        <MotiView
          from={{ translateY: 420 }}
          animate={{ translateY: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          style={S.filterSheet}
        >
          <View style={S.handle} />

          <Text style={S.filterTitle}>Filter</Text>
          <Text style={S.filterSubtitle}>Choose a category</Text>

          <View style={S.filterGrid}>
            {CATEGORIES.map((cat) => {
              const active = cat === selected;
              const { accent } = cat === 'All'
                ? { accent: T.accent }
                : hueFor(cat);
              return (
                <ScalePressable
                  key={cat}
                  onPress={() => { onSelect(cat); onClose(); }}
                  scaleDown={0.94}
                  style={[
                    S.filterChip,
                    active && {
                      backgroundColor: accent,
                      borderColor: accent,
                    },
                  ]}
                >
                  <Text style={[
                    S.filterChipText,
                    active && { color: '#0a0a0f', fontWeight: '700' },
                  ]}>
                    {cat}
                  </Text>
                </ScalePressable>
              );
            })}
          </View>

          <Pressable onPress={onClose} style={S.doneBtn}>
            <LinearGradient
              colors={[T.accent, T.teal]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={S.doneText}>Done</Text>
          </Pressable>
        </MotiView>
      </View>
    </Modal>
  );
}

/* ─── Main Screen ────────────────────────────────────────────────── */
export default function CoursesScreen() {
  const { courses, enrollCourse } = useApp();
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      const matchCat = category === 'All' || c.category === category;
      const matchQ = !q
        || c.title.toLowerCase().includes(q)
        || c.instructor.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [courses, category, query]);

  return (
    <SafeAreaView style={S.root} edges={['top']}>
      {/* subtle top-center violet glow */}
      <LinearGradient
        colors={['rgba(124,109,250,0.08)', 'transparent']}
        style={S.topGlow}
        pointerEvents="none"
      />

      {/* ── Header ── */}
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 240 }}
        style={S.header}
      >
        <View style={S.titleRow}>
          <Text style={S.title}>Explore</Text>
          <Text style={S.subtitle}>
            {filtered.length} course{filtered.length === 1 ? '' : 's'}
          </Text>
        </View>

        <View style={S.searchRow}>
          <Glass style={S.searchWrap}>
            <Ionicons name="search" size={15} color={T.textSub} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search courses, instructors…"
              placeholderTextColor={T.textMuted}
              style={S.searchInput}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} hitSlop={10}>
                <Ionicons name="close-circle" size={16} color={T.textSub} />
              </Pressable>
            )}
          </Glass>

          {/* Filter icon button */}
          <ScalePressable onPress={() => setFilterOpen(true)} scaleDown={0.9}>
            <Glass style={S.filterBtn}>
              <Ionicons name="options-outline" size={20} color={T.text} />
              {category !== 'All' && (
                <View style={[S.filterDot, { backgroundColor: hueFor(category).accent }]} />
              )}
            </Glass>
          </ScalePressable>
        </View>

        {/* Active filter pill (removable) */}
        <AnimatePresence>
          {category !== 'All' && (
            <MotiView
              from={{ opacity: 0, translateY: -6 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -6 }}
              transition={{ type: 'timing', duration: 200 }}
              style={S.activePillWrap}
            >
              <Pressable
                onPress={() => setCategory('All')}
                style={[
                  S.activePill,
                  { borderColor: hueFor(category).accent + '77' },
                ]}
              >
                <Text style={[S.activePillText, { color: hueFor(category).accent }]}>
                  {category}
                </Text>
                <Ionicons name="close" size={13} color={hueFor(category).accent} />
              </Pressable>
            </MotiView>
          )}
        </AnimatePresence>
      </MotiView>

      {/* ── Grid ── */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        numColumns={2}
        contentContainerStyle={S.grid}
        columnWrapperStyle={S.gridRow}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={S.emptyWrap}>
            <Ionicons name="sparkles-outline" size={44} color={T.textMuted} />
            <Text style={S.emptyText}>No courses match your filters</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <CourseCard item={item} index={index} onPress={() => setSelected(item)} />
        )}
      />

      {/* ── Filter popup ── */}
      <FilterSheet
        visible={filterOpen}
        selected={category}
        onSelect={setCategory}
        onClose={() => setFilterOpen(false)}
      />

      {/* ── Detail sheet ── */}
      <Modal
        visible={!!selected}
        animationType="slide"
        transparent
        onRequestClose={() => setSelected(null)}
      >
        <View style={S.modalRoot}>
          <Pressable style={S.backdrop} onPress={() => setSelected(null)} />
          <MotiView
            from={{ translateY: 500 }}
            animate={{ translateY: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            style={S.detailSheet}
          >
            {selected && (
              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                <View style={S.handle} />

                <View style={S.detailBanner}>
                  <LinearGradient
                    colors={[hueFor(selected.category).tint, 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={[S.stripe, { backgroundColor: hueFor(selected.category).accent }]} />
                  <View style={{ paddingLeft: 24, paddingVertical: 24 }}>
                    <Text style={[S.detailCategory, { color: hueFor(selected.category).accent }]}>
                      {selected.category.toUpperCase()}
                    </Text>
                    <Text style={S.detailTitle} numberOfLines={3}>{selected.title}</Text>
                    <Text style={S.detailInstructor}>{selected.instructor}</Text>
                  </View>
                </View>

                <View style={S.sheetBody}>
                  <View style={S.metaRow}>
                    {[selected.level, selected.duration, `₹${selected.price}`].map((v) => (
                      <View key={v} style={S.metaChip}>
                        <Text style={S.metaText}>{v}</Text>
                      </View>
                    ))}
                  </View>

                  <Text style={S.sheetDesc}>{selected.description}</Text>
                  <Text style={S.sheetNote}>DAIR.AI · Mentor Board · Hiring Partners</Text>

                  <View style={S.sheetActions}>
                    <ScalePressable
                      onPress={() => Linking.openURL(selected.url)}
                      style={S.watchBtn}
                      scaleDown={0.94}
                    >
                      <Ionicons name="logo-youtube" size={17} color={T.text} />
                      <Text style={S.watchText}>Watch Free</Text>
                    </ScalePressable>
                    <ScalePressable
                      onPress={() => enrollCourse(selected.id)}
                      style={[S.enrollBtn, selected.enrolled && S.enrolledBtn]}
                      scaleDown={0.94}
                    >
                      {!selected.enrolled && (
                        <LinearGradient
                          colors={[T.accent, T.teal]}
                          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                          style={StyleSheet.absoluteFill}
                        />
                      )}
                      <Ionicons
                        name={selected.enrolled ? 'checkmark' : 'flash'}
                        size={17}
                        color={selected.enrolled ? T.teal : '#0a0a0f'}
                      />
                      <Text style={[
                        S.enrollText,
                        { color: selected.enrolled ? T.teal : '#0a0a0f' },
                      ]}>
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

/* ─── Styles ─────────────────────────────────────────────────────── */
const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  topGlow: { position: 'absolute', left: 0, right: 0, top: 0, height: 240 },

  /* Header */
  header: { paddingHorizontal: GUTTER, paddingTop: 8, paddingBottom: 10, gap: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  title: {
    color: T.text, fontSize: 30, fontWeight: '700',
    letterSpacing: -1.2,
  },
  subtitle: { color: T.textMuted, fontSize: 12, fontWeight: '500', marginBottom: 6 },

  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 14, overflow: 'hidden',
  },
  searchInput: {
    flex: 1, color: T.text, fontSize: 14, fontWeight: '400',
    ...(IS_WEB ? { outlineStyle: 'none' } : null),
  },
  filterBtn: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  filterDot: {
    position: 'absolute', top: 9, right: 9,
    width: 8, height: 8, borderRadius: 4,
  },

  activePillWrap: { flexDirection: 'row' },
  activePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 999, borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  activePillText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.2 },

  /* Grid */
  grid: { paddingHorizontal: GUTTER, paddingBottom: 140, gap: GUTTER },
  gridRow: { gap: GUTTER },

  /* Card */
  cardOuter: { borderRadius: 20, overflow: 'hidden' },
  card: {
    borderRadius: 20, overflow: 'hidden',
    minHeight: 196,
  },
  stripe: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
  },
  enrolledMark: {
    position: 'absolute', top: 10, right: 10,
    width: 20, height: 20, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
    zIndex: 2,
  },
  cardInner: {
    padding: 14, paddingLeft: 16,
    flex: 1, justifyContent: 'space-between',
    gap: 6,
  },
  cardCategory: {
    fontSize: 9.5, fontWeight: '700',
    letterSpacing: 1.4,
  },
  cardTitle: {
    color: T.text, fontSize: 14, lineHeight: 18,
    fontWeight: '600', letterSpacing: -0.3,
    marginTop: 4,
  },
  cardInstructor: {
    color: T.textSub, fontSize: 11, fontWeight: '400',
    marginTop: 2,
  },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: T.glassBorder,
    marginVertical: 8,
  },
  cardFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  levelPill: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 999, borderWidth: 1,
  },
  levelText: { fontSize: 8.5, fontWeight: '700', letterSpacing: 0.8 },
  price: {
    color: T.text, fontSize: 14, fontWeight: '600',
    letterSpacing: -0.3,
  },

  /* Empty state */
  emptyWrap: {
    paddingTop: 80, alignItems: 'center', gap: 12, width: SCREEN_W,
  },
  emptyText: { color: T.textSub, fontSize: 13, fontWeight: '500' },

  /* Modals (shared) */
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  handle: {
    alignSelf: 'center', width: 42, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.18)', marginTop: 12, marginBottom: 4,
  },

  /* Filter sheet */
  filterSheet: {
    backgroundColor: '#0f0f1a',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderTopWidth: 1, borderColor: T.glassBorder,
    paddingHorizontal: 20, paddingBottom: 28,
  },
  filterTitle: {
    color: T.text, fontSize: 22, fontWeight: '700',
    letterSpacing: -0.6, marginTop: 14,
  },
  filterSubtitle: { color: T.textSub, fontSize: 13, marginTop: 4, marginBottom: 18 },
  filterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1, borderColor: T.glassBorder,
    backgroundColor: T.glassBg,
  },
  filterChipText: { color: T.textSub, fontSize: 13, fontWeight: '500' },
  doneBtn: {
    marginTop: 24, height: 50, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  doneText: { color: '#0a0a0f', fontSize: 14, fontWeight: '700', letterSpacing: 0.3 },

  /* Detail sheet */
  detailSheet: {
    backgroundColor: '#0f0f1a',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: '92%',
    borderTopWidth: 1, borderColor: T.glassBorder,
  },
  detailBanner: {
    marginTop: 10, marginHorizontal: 16,
    borderRadius: 18, overflow: 'hidden',
    borderWidth: 1, borderColor: T.glassBorder,
    backgroundColor: T.glassBg,
  },
  detailCategory: {
    fontSize: 10, fontWeight: '700',
    letterSpacing: 1.6, marginBottom: 10,
  },
  detailTitle: {
    color: T.text, fontSize: 24, fontWeight: '700',
    letterSpacing: -0.8, lineHeight: 28,
  },
  detailInstructor: { color: T.textSub, fontSize: 13, marginTop: 8, fontWeight: '400' },

  sheetBody: { padding: 24 },
  metaRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  metaChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 999, borderWidth: 1,
    borderColor: T.glassBorder, backgroundColor: T.glassBg,
  },
  metaText: { color: T.text, fontSize: 11, fontWeight: '600' },
  sheetDesc: { color: T.textSub, marginTop: 18, lineHeight: 20, fontSize: 13, fontWeight: '400' },
  sheetNote: { color: T.textMuted, marginTop: 14, fontSize: 10.5, fontWeight: '600', letterSpacing: 1.2 },
  sheetActions: { flexDirection: 'row', gap: 12, marginTop: 22, marginBottom: 12 },
  watchBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 12,
    backgroundColor: T.glassBg, borderWidth: 1, borderColor: T.glassBorder,
  },
  watchText: { color: T.text, fontSize: 13, fontWeight: '600', letterSpacing: 0.2 },
  enrollBtn: {
    flex: 1.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 12, overflow: 'hidden',
  },
  enrolledBtn: {
    backgroundColor: 'rgba(94,234,212,0.12)',
    borderWidth: 1, borderColor: 'rgba(94,234,212,0.4)',
  },
  enrollText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.3 },
});
