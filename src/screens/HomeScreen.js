import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList, Image, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import GlassCard from '../components/GlassCard';
import { colors, spacing, radius, gradients, typography } from '../constants/theme';
import { useApp } from '../context/AppContext';

const STORY_AVATARS = ['KA', 'AN', 'SU', 'HF', 'DM', 'FA', 'MI', 'LL'];

export default function HomeScreen({ navigation }) {
  const { courses, coins, reels } = useApp();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <LinearGradient
        colors={["#050505", "#0B0216"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 520 }}
          style={styles.topBar}
        >
          <View>
            <Text style={styles.brandSmall}>eduai</Text>
            <Text style={styles.brandMono}>learn · watch · chat</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <GlassCard radiusSize={radius.pill} style={styles.iconBtn}>
              <Ionicons name="search" size={18} color={colors.text} />
            </GlassCard>
            <GlassCard radiusSize={radius.pill} style={styles.coinsPill}>
              <Ionicons name="sparkles" size={14} color={colors.accentSerif} />
              <Text style={styles.coinsText}>{coins}</Text>
            </GlassCard>
          </View>
        </MotiView>

        {/* Stories row */}
        <FlatList
          horizontal
          data={STORY_AVATARS}
          keyExtractor={(i, idx) => i + idx}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.md }}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 380, delay: index * 40, easing: Easing.inOut(Easing.cubic) }}
              style={styles.storyItem}
            >
              <LinearGradient
                colors={gradients.cinematic}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.storyRing}
              >
                <View style={styles.storyInner}>
                  <Text style={styles.storyAvatarText}>{item}</Text>
                </View>
              </LinearGradient>
              <Text style={styles.storyName}>live_{index + 1}</Text>
            </MotiView>
          )}
        />

        {/* Hero glass card */}
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm }}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 560, delay: 120, easing: Easing.inOut(Easing.cubic) }}
          >
            <GlassCard radiusSize={radius.xxl} style={styles.hero}>
              <LinearGradient
                colors={["rgba(6,182,212,0.22)", "rgba(236,72,153,0.18)", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.heroKicker}>AI LEARNING · LIVE</Text>
              <Text style={styles.heroTitle}>Evolve. Deploy.{"\n"}Master AI.</Text>
              <Text style={styles.heroSub}>Swipe reels, take courses, and chat live with top AI models — all in one app.</Text>

              <View style={styles.heroCtaRow}>
                <Pressable onPress={() => navigation.navigate('Courses')} style={({ pressed }) => [styles.ctaPill, styles.ctaPrimary, pressed && styles.pressed]}>
                  <Ionicons name="book" size={15} color="#fff" />
                  <Text style={[styles.ctaText, styles.ctaTextPrimary]}>COURSES</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate('Playground')} style={({ pressed }) => [styles.ctaPill, pressed && styles.pressed]}>
                  <Ionicons name="sparkles-outline" size={15} color={colors.text} />
                  <Text style={styles.ctaText}>AI CHAT</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate('Reels')} style={({ pressed }) => [styles.ctaPill, pressed && styles.pressed]}>
                  <Ionicons name="play" size={15} color={colors.text} />
                  <Text style={styles.ctaText}>REELS</Text>
                </Pressable>
              </View>
            </GlassCard>
          </MotiView>
        </View>

        {/* Section title */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionKicker}>NEURAL REGISTRY</Text>
            <Text style={styles.sectionTitle}>Live Modules</Text>
          </View>
          <Pressable onPress={() => navigation.navigate('Courses')}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        {/* Course carousel */}
        <FlatList
          horizontal
          data={courses.slice(0, 10)}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateX: 30 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 420, delay: 120 + index * 35, easing: Easing.inOut(Easing.cubic) }}
            >
              <Pressable onPress={() => navigation.navigate('Courses')}>
                <GlassCard radiusSize={radius.lg} style={styles.card}>
                  <LinearGradient
                    colors={["rgba(6,182,212,0.24)", "rgba(236,72,153,0.26)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardCover}
                  >
                    <View style={styles.cardPlayPill}>
                      <Ionicons name="play" size={12} color="#fff" />
                      <Text style={styles.cardPlayText}>WATCH</Text>
                    </View>
                    <Text style={styles.cardCategory}>{item.category.toUpperCase()}</Text>
                  </LinearGradient>
                  <View style={{ padding: spacing.md }}>
                    <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.cardMeta} numberOfLines={1}>{item.instructor}</Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.cardPrice}>₹{item.price}</Text>
                      <Text style={styles.cardLevel}>{item.level}</Text>
                    </View>
                  </View>
                </GlassCard>
              </Pressable>
            </MotiView>
          )}
        />

        {/* Playground card */}
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.xl }}>
          <Text style={styles.sectionKicker}>FAST PATH</Text>
          <Text style={styles.sectionTitle}>Try the AI Playground</Text>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 620, delay: 180, easing: Easing.inOut(Easing.cubic) }}
            style={{ marginTop: spacing.md }}
          >
            <Pressable onPress={() => navigation.navigate('Playground')}>
              <GlassCard radiusSize={radius.xxl} style={styles.bigCard}>
                <LinearGradient
                  colors={["rgba(6,182,212,0.2)", "rgba(236,72,153,0.22)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={{ padding: spacing.xl }}>
                  <View style={styles.modelRow}>
                    {['#10a37f', '#d4a27f', '#4285f4', '#ff6b35', '#0082fb'].map((c, i) => (
                      <View key={i} style={[styles.modelDot, { backgroundColor: c, marginLeft: i === 0 ? 0 : -8 }]} />
                    ))}
                  </View>
                  <Text style={styles.bigCardTitle}>GPT-4o · Claude 3.5 · Gemini</Text>
                  <Text style={styles.bigCardSub}>Live answers powered by OpenRouter. Switch models and ask anything.</Text>
                  <View style={styles.bigCardFooter}>
                    <Text style={styles.bigCardCta}>OPEN PLAYGROUND</Text>
                    <Ionicons name="arrow-forward" size={14} color={colors.accentSerif} />
                  </View>
                </View>
              </GlassCard>
            </Pressable>
          </MotiView>
        </View>

        {/* Reels teaser */}
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.xl }}>
          <Text style={styles.sectionKicker}>TRENDING</Text>
          <Text style={styles.sectionTitle}>Reels</Text>
        </View>
        <FlatList
          horizontal
          data={reels}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md, paddingTop: spacing.md }}
          renderItem={({ item, index }) => (
            <Pressable onPress={() => navigation.navigate('Reels')}>
              <View style={styles.reelThumb}>
                <Image
                  source={{ uri: `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg` }}
                  style={StyleSheet.absoluteFill}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.85)"]}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.reelOverlay}>
                  <View style={styles.reelPlay}><Ionicons name="play" size={14} color="#fff" /></View>
                  <Text style={styles.reelTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.reelCreator}>@{item.handle?.replace('@','')}</Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  topBar: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandSmall: { color: colors.text, fontWeight: typography.heavy, fontSize: 26, letterSpacing: -1.2, fontFamily: typography.family },
  brandMono: { color: colors.textMuted, fontSize: 10, letterSpacing: 2, marginTop: 2 },
  iconBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  coinsPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 9 },
  coinsText: { color: colors.text, fontSize: 12, fontWeight: '800' },
  storyItem: { alignItems: 'center', gap: 6, width: 74 },
  storyRing: { width: 68, height: 68, borderRadius: 34, padding: 3 },
  storyInner: { flex: 1, borderRadius: 31, backgroundColor: 'rgba(5,5,5,0.9)', alignItems: 'center', justifyContent: 'center' },
  storyAvatarText: { color: colors.text, fontWeight: '900', letterSpacing: 1 },
  storyName: { color: colors.textDim, fontSize: 10, fontWeight: '700' },
  hero: { padding: spacing.xl, overflow: 'hidden' },
  heroKicker: { color: colors.accentSerif, fontSize: 10, letterSpacing: 3, fontWeight: '800' },
  heroTitle: { color: colors.text, fontSize: 34, fontWeight: typography.heavy, letterSpacing: -1.7, marginTop: spacing.sm, lineHeight: 36, fontFamily: typography.family },
  heroSub: { color: colors.textDim, marginTop: spacing.md, lineHeight: 20, fontSize: 13 },
  heroCtaRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg, flexWrap: 'wrap' },
  ctaPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  ctaPrimary: { backgroundColor: '#FFFFFF', borderColor: 'transparent' },
  ctaText: { color: colors.text, fontWeight: '800', fontSize: 11, letterSpacing: 1.5, fontFamily: typography.family },
  ctaTextPrimary: { color: '#050505' },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  sectionHeader: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  sectionKicker: { color: colors.accent, fontSize: 10, letterSpacing: 3, fontWeight: '800' },
  sectionTitle: { color: colors.text, fontSize: 22, fontWeight: typography.heavy, marginTop: 4, letterSpacing: -0.8, fontFamily: typography.family },
  seeAll: { color: colors.accentSerif, fontSize: 12, fontWeight: '700' },
  card: { width: 240, overflow: 'hidden' },
  cardCover: { height: 130, padding: spacing.md, justifyContent: 'space-between' },
  cardPlayPill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.08)' },
  cardPlayText: { color: '#fff', fontSize: 9, letterSpacing: 1.5, fontWeight: '900' },
  cardCategory: { color: '#fff', fontWeight: '900', letterSpacing: 2, fontSize: 10 },
  cardTitle: { color: colors.text, fontSize: 14, fontWeight: '800', marginBottom: 4 },
  cardMeta: { color: colors.textDim, fontSize: 11, marginBottom: spacing.md },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { color: colors.accentSerif, fontWeight: '800', fontSize: 14 },
  cardLevel: { color: colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  bigCard: { overflow: 'hidden' },
  modelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  modelDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#050505' },
  bigCardTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  bigCardSub: { color: colors.textDim, marginTop: spacing.sm, lineHeight: 18 },
  bigCardFooter: { marginTop: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: 8 },
  bigCardCta: { color: colors.accentSerif, fontWeight: '800', letterSpacing: 2, fontSize: 12 },
  reelThumb: { width: 140, height: 220, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#0E0E0E', borderWidth: 1, borderColor: colors.border },
  reelOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 10, gap: 4 },
  reelPlay: { alignSelf: 'flex-start', width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  reelTitle: { color: '#fff', fontWeight: '800', fontSize: 12 },
  reelCreator: { color: 'rgba(255,255,255,0.82)', fontSize: 10 },
});
