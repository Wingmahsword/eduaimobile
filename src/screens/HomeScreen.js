import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { MotiView } from 'moti';
import GlassCard from '../components/GlassCard';
import ScalePressable from '../components/ScalePressable';
import { colors, spacing, radius, typography } from '../constants/theme';
import { COMPREHENSIVE_COURSE_IDS } from '../constants/comprehensiveCourses';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const STORIES = [
  { key: 'you', label: 'Your Story', initials: '+', gradient: null },
  { key: 'KA', label: 'krish_ai',   initials: 'KA', gradient: ['#7C3AED','#EC4899'] },
  { key: 'AN', label: 'anna.ml',    initials: 'AN', gradient: ['#F59E0B','#EF4444'] },
  { key: 'SU', label: 'su_dev',     initials: 'SU', gradient: ['#06B6D4','#8B5CF6'] },
  { key: 'HF', label: 'hf_user',    initials: 'HF', gradient: ['#10B981','#06B6D4'] },
  { key: 'DM', label: 'dm_pro',     initials: 'DM', gradient: ['#EC4899','#F59E0B'] },
  { key: 'FA', label: 'fazil.gpt',  initials: 'FA', gradient: ['#8B5CF6','#06B6D4'] },
  { key: 'MI', label: 'mihail.ai',  initials: 'MI', gradient: ['#FF3B6B','#7C3AED'] },
];

const POST_GRADIENTS = [
  ['#06B6D4','#7C3AED'],
  ['#EC4899','#F59E0B'],
  ['#10B981','#06B6D4'],
  ['#8B5CF6','#EC4899'],
  ['#F59E0B','#EF4444'],
  ['#06B6D4','#10B981'],
];

function StoryCircle({ item, index }) {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 14, stiffness: 260, delay: index * 40 }}
      style={styles.storyWrap}
    >
      <Pressable style={styles.storyTouch}>
        {item.gradient ? (
          <LinearGradient colors={item.gradient} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={styles.storyRing}>
            <View style={styles.storyInner}>
              <Text style={styles.storyInitials}>{item.initials}</Text>
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.storyAdd}>
            <View style={styles.storyInnerAdd}>
              <Ionicons name="add" size={22} color="#fff" />
            </View>
          </View>
        )}
        <Text style={styles.storyLabel} numberOfLines={1}>{item.label}</Text>
      </Pressable>
    </MotiView>
  );
}

function CoursePost({ item, index, onPress, postHeight }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const heartSv = useSharedValue(1);
  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: heartSv.value }] }));

  const handleLike = () => {
    setLiked((v) => !v);
    heartSv.value = withSpring(1.5, { damping: 8, stiffness: 500 });
    setTimeout(() => { heartSv.value = withSpring(1, { damping: 12, stiffness: 300 }); }, 200);
  };

  const grad = POST_GRADIENTS[index % POST_GRADIENTS.length];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 28 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 18, stiffness: 180, delay: 80 + index * 60 }}
    >
      {/* Post header */}
      <View style={styles.postHeader}>
        <LinearGradient colors={grad} style={styles.postAvatar}>
          <Text style={styles.postAvatarText}>{item.category?.[0] ?? 'C'}</Text>
        </LinearGradient>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.postUser}>{item.instructor}</Text>
          <Text style={styles.postSub}>{item.category} · {item.duration}</Text>
        </View>
        <Pressable hitSlop={10}>
          <Ionicons name="ellipsis-horizontal" size={20} color="rgba(255,255,255,0.45)" />
        </Pressable>
      </View>

      {/* Cover */}
      <ScalePressable onPress={onPress} scaleDown={0.985}>
        <LinearGradient colors={[grad[0] + '55', grad[1] + '66', 'rgba(0,0,0,0.3)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.postCover, { height: postHeight }]}
        >
          <View style={styles.coverBadgeRow}>
            <View style={styles.levelBadge}><Text style={styles.levelBadgeText}>{item.level}</Text></View>
            <View style={styles.playBadge}>
              <Ionicons name="play" size={10} color="#fff" />
              <Text style={styles.playBadgeText}>PREVIEW</Text>
            </View>
          </View>
          <Text style={styles.postTitle} numberOfLines={2}>{item.title}</Text>
        </LinearGradient>
      </ScalePressable>

      {/* Actions */}
      <View style={styles.postActions}>
        <View style={styles.actionsLeft}>
          <Pressable onPress={handleLike} hitSlop={8}>
            <Animated.View style={heartStyle}>
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={27} color={liked ? '#FF3B6B' : '#fff'} />
            </Animated.View>
          </Pressable>
          <Pressable onPress={onPress} style={{ marginLeft: 16 }} hitSlop={8}>
            <Ionicons name="chatbubble-outline" size={25} color="#fff" />
          </Pressable>
          <Pressable style={{ marginLeft: 16 }} hitSlop={8}>
            <Ionicons name="paper-plane-outline" size={25} color="#fff" />
          </Pressable>
        </View>
        <Pressable onPress={() => setSaved((v) => !v)} hitSlop={8}>
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={25} color={saved ? colors.accentSerif : '#fff'} />
        </Pressable>
      </View>

      {/* Caption + enroll */}
      <View style={styles.postCaption}>
        <Text style={styles.captionLine}>
          <Text style={styles.captionUser}>{item.instructor} </Text>
          <Text style={styles.captionText}>{item.title}</Text>
        </Text>
        <View style={styles.captionFooter}>
          <Text style={styles.priceTag}>₹{item.price}</Text>
          <ScalePressable onPress={onPress} scaleDown={0.92}>
            <View style={styles.enrollPill}>
              <Text style={styles.enrollPillText}>Enroll Now</Text>
            </View>
          </ScalePressable>
        </View>
      </View>
    </MotiView>
  );
}

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const { courses, coins, reels } = useApp();
  const { profile, signOut } = useAuth();
  const isCompact = width < 390;
  const postHeight = Math.min(360, Math.max(260, width * 0.92));
  const reelWidth = Math.round(Math.min(150, Math.max(112, width * 0.34)));
  const reelHeight = Math.round(reelWidth * 1.62);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Instagram-style header */}
      <MotiView
        from={{ opacity: 0, translateY: -14 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 240 }}
        style={[styles.header, { paddingHorizontal: isCompact ? spacing.md : spacing.lg }]}
      >
        <Text style={[styles.logo, { fontSize: isCompact ? 24 : 28 }]}>EduAI</Text>
        <View style={styles.headerIcons}>
          <ScalePressable onPress={() => navigation.navigate('DM')} scaleDown={0.86}>
            <View style={styles.dmBtn}>
              <Ionicons name="paper-plane-outline" size={20} color="#fff" />
              <View style={styles.dmDot} />
            </View>
          </ScalePressable>
          <ScalePressable onPress={() => navigation.navigate('Playground')} scaleDown={0.86}>
            <Ionicons name="sparkles-outline" size={24} color="#fff" />
          </ScalePressable>
          <ScalePressable scaleDown={0.86}>
            <GlassCard radiusSize={radius.pill} style={styles.coinsPill}>
              <Ionicons name="diamond" size={13} color={colors.accentSerif} />
              <Text style={styles.coinsText}>{coins}</Text>
            </GlassCard>
          </ScalePressable>
          <ScalePressable onPress={signOut} scaleDown={0.86}>
            <LinearGradient colors={['#06B6D4','#8B5CF6']} style={styles.avatarPill}>
              <Text style={styles.avatarText}>
                {profile?.display_name?.[0]?.toUpperCase() ?? '?'}
              </Text>
            </LinearGradient>
          </ScalePressable>
        </View>
      </MotiView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Stories strip */}
        <FlatList
          horizontal
          data={STORIES}
          keyExtractor={(s) => s.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContainer}
          renderItem={({ item, index }) => <StoryCircle item={item} index={index} />}
          style={styles.storiesList}
        />

        <View style={styles.hairline} />

        {/* AI Playground prompt card */}
        <MotiView
          from={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 16, stiffness: 200, delay: 100 }}
          style={{ marginHorizontal: spacing.lg, marginTop: 18, marginBottom: 4 }}
        >
          <ScalePressable onPress={() => navigation.navigate('Playground')} scaleDown={0.97}>
            <LinearGradient
              colors={['rgba(6,182,212,0.18)','rgba(139,92,246,0.22)','rgba(236,72,153,0.18)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.playgroundBanner}
            >
              <View style={styles.modelDots}>
                {['#10a37f','#d4a27f','#4285f4','#ff6b35'].map((c, i) => (
                  <View key={i} style={[styles.modelDot, { backgroundColor: c, marginLeft: i === 0 ? 0 : -6 }]} />
                ))}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>GPT-4o · Claude · Gemini</Text>
                <Text style={styles.bannerSub}>Ask anything live →</Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={28} color="rgba(255,255,255,0.7)" />
            </LinearGradient>
          </ScalePressable>
        </MotiView>

        <View style={[styles.hairline, { marginTop: 18 }]} />

        {/* Feed: course posts */}
        {courses.slice(0, 7).map((item, index) => (
          <CoursePost
            key={item.id}
            item={item}
            index={index}
            postHeight={postHeight}
            onPress={() =>
              COMPREHENSIVE_COURSE_IDS.includes(item.id)
                ? navigation.navigate('CourseDetail', { courseId: item.id })
                : navigation.navigate('Courses')
            }
          />
        ))}

        {/* Reels teaser */}
        <View style={styles.reelsSection}>
          <View style={styles.reelsSectionHeader}>
            <Ionicons name="play-circle" size={20} color={colors.accent} />
            <Text style={styles.reelsSectionTitle}>Trending Reels</Text>
            <Pressable onPress={() => navigation.navigate('Reels')} style={{ marginLeft: 'auto' }}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          <FlatList
            horizontal
            data={reels}
            keyExtractor={(r) => r.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingHorizontal: spacing.lg }}
            renderItem={({ item }) => (
              <ScalePressable onPress={() => navigation.navigate('Reels')} scaleDown={0.93}>
                <View style={[styles.reelThumb, { width: reelWidth, height: reelHeight }]}> 
                  <Image
                    source={{ uri: `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg` }}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                  />
                  <LinearGradient colors={['transparent','rgba(0,0,0,0.82)']} style={StyleSheet.absoluteFill} />
                  <View style={styles.reelOverlay}>
                    <Ionicons name="play" size={16} color="#fff" />
                    <Text style={styles.reelCaption} numberOfLines={2}>{item.title}</Text>
                  </View>
                </View>
              </ScalePressable>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.1)' },
  logo: { flex: 1, color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: -1.3, fontFamily: typography.family },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dmBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  dmDot: { position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#EC4899' },
  coinsPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 7 },
  coinsText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  avatarPill: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 14 },

  storiesList: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)' },
  storiesContainer: { paddingHorizontal: spacing.md, paddingVertical: 14, gap: 16 },
  storyWrap: { alignItems: 'center' },
  storyTouch: { alignItems: 'center', gap: 6 },
  storyRing: { width: 66, height: 66, borderRadius: 33, padding: 2.5, alignItems: 'center', justifyContent: 'center' },
  storyInner: { flex: 1, width: '100%', borderRadius: 30, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  storyInitials: { color: '#fff', fontWeight: '900', fontSize: 17, letterSpacing: 0.3 },
  storyAdd: { width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.07)', alignItems: 'center', justifyContent: 'center' },
  storyInnerAdd: { alignItems: 'center', justifyContent: 'center' },
  storyLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '600', maxWidth: 66, textAlign: 'center' },

  hairline: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.1)' },

  playgroundBanner: { borderRadius: radius.xl, flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modelDots: { flexDirection: 'row', alignItems: 'center' },
  modelDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#000' },
  bannerTitle: { color: '#fff', fontWeight: '700', fontSize: 14 },
  bannerSub: { color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 2 },

  postHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 14, paddingBottom: 10 },
  postAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  postAvatarText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  postUser: { color: '#fff', fontWeight: '700', fontSize: 13 },
  postSub: { color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 1 },
  postCover: { width: '100%', justifyContent: 'space-between', padding: spacing.lg },
  coverBadgeRow: { flexDirection: 'row', gap: 8 },
  levelBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: 'rgba(0,0,0,0.45)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  levelBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  playBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: 'rgba(0,0,0,0.45)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  playBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  postTitle: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: -0.7, lineHeight: 26 },
  postActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: 10 },
  actionsLeft: { flexDirection: 'row', alignItems: 'center' },
  postCaption: { paddingHorizontal: spacing.lg, paddingBottom: 14, gap: 4 },
  captionLine: { fontSize: 13, lineHeight: 18 },
  captionUser: { color: '#fff', fontWeight: '700' },
  captionText: { color: 'rgba(255,255,255,0.65)' },
  captionFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  priceTag: { color: colors.accentSerif, fontWeight: '800', fontSize: 16 },
  enrollPill: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: radius.pill, backgroundColor: '#fff' },
  enrollPillText: { color: '#000', fontWeight: '800', fontSize: 12, letterSpacing: 0.3 },

  reelsSection: { paddingTop: 24 },
  reelsSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  reelsSectionTitle: { color: '#fff', fontWeight: '800', fontSize: 15 },
  seeAll: { color: colors.accentSerif, fontWeight: '700', fontSize: 13 },
  reelThumb: { width: 130, height: 210, borderRadius: radius.md, overflow: 'hidden', backgroundColor: '#111' },
  reelOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, gap: 5 },
  reelCaption: { color: '#fff', fontWeight: '700', fontSize: 11, lineHeight: 14 },
});
