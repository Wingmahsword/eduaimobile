import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Pressable, Image, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView, AnimatePresence } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import HlsVideoPlayer from '../components/HlsVideoPlayer';
import { colors, spacing, radius, typography } from '../constants/theme';
import { useApp } from '../context/AppContext';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');

const GLASS_BG = 'rgba(255,255,255,0.08)';
const GLASS_BORDER = 'rgba(255,255,255,0.18)';

function GlassView({ style, intensity = 18, children }) {
  if (Platform.OS === 'web') {
    return (
      <View style={[{ backgroundColor: 'rgba(20,20,35,0.55)', borderColor: GLASS_BORDER, borderWidth: 1 }, style]}>
        {children}
      </View>
    );
  }
  return (
    <BlurView intensity={intensity} tint="dark" style={[{ borderColor: GLASS_BORDER, borderWidth: 1, overflow: 'hidden' }, style]}>
      {children}
    </BlurView>
  );
}

function ActionBtn({ icon, label, onPress, active, activeColor = '#FF3B6B', size = 26 }) {
  return (
    <Pressable onPress={onPress} style={styles.actionBtn}>
      <MotiView
        animate={{ scale: active ? 1.2 : 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
      >
        <Ionicons
          name={icon}
          size={size}
          color={active ? activeColor : 'rgba(255,255,255,0.92)'}
        />
      </MotiView>
      {!!label && <Text style={styles.actionLabel}>{label}</Text>}
    </Pressable>
  );
}

function ReelItem({ item, isActive, height, topInset, muted, onToggleMute, onToggleLike, onToggleSave }) {
  const [paused, setPaused] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const lastTapRef = useRef(0);

  const handlePress = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 280) {
      if (!item.liked) onToggleLike();
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 900);
    } else {
      setPaused((p) => !p);
      setShowPauseIcon(true);
      setTimeout(() => setShowPauseIcon(false), 700);
    }
    lastTapRef.current = now;
  };

  return (
    <Pressable onPress={handlePress} style={[styles.reel, { height, width: SCREEN_W }]}>

      {/* Blurred ambient background */}
      <Image
        source={{ uri: item.posterUrl || `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg` }}
        style={StyleSheet.absoluteFill}
        blurRadius={28}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.38)' }]} />

      {/* Video layer */}
      <View style={styles.videoCrop}>
        {isActive && (
          <View style={[styles.videoInner, { width: height * (16 / 9), height }]}>
            {item.hlsUrl && Platform.OS !== 'web' ? (
              <HlsVideoPlayer
                hlsUrl={item.hlsUrl}
                muted={muted}
                shouldPlay={!paused && isActive}
                style={styles.hlsVideo}
              />
            ) : (
              <YoutubePlayer
                height={height}
                width={height * (16 / 9)}
                videoId={item.youtubeId}
                play={!paused}
                mute={muted}
                webViewProps={{ allowsInlineMediaPlayback: true, mediaPlaybackRequiresUserAction: false }}
                initialPlayerParams={{ controls: false, modestbranding: true, loop: true, playerLang: 'en', preventFullScreen: true, showClosedCaptions: false, rel: false }}
              />
            )}
          </View>
        )}
      </View>

      {/* Cinematic top vignette */}
      <LinearGradient
        colors={['rgba(0,0,0,0.72)', 'transparent']}
        style={styles.topShade}
      />

      {/* Cinematic bottom vignette — deeper */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.92)']}
        locations={[0, 0.55, 1]}
        style={styles.bottomShade}
      />

      {/* ── TOP BAR ── glass pill */}
      <View style={[styles.topBar, { top: Math.max(16, topInset + 6) }]}>
        <GlassView style={styles.brandPill} intensity={22}>
          <LinearGradient
            colors={['#FF3B6B', '#8B5CF6']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.brandAccentLine}
          />
          <Text style={styles.reelsBrand}>Reels</Text>
        </GlassView>

        <Pressable onPress={onToggleMute}>
          <GlassView style={styles.muteChip} intensity={22}>
            <Ionicons
              name={muted ? 'volume-mute' : 'volume-high'}
              size={16}
              color="rgba(255,255,255,0.9)"
            />
          </GlassView>
        </Pressable>
      </View>

      {/* ── RIGHT SIDEBAR — glass pill container ── */}
      <View style={styles.sidebar}>
        <GlassView style={styles.sidebarPill} intensity={20}>
          <ActionBtn
            icon={item.liked ? 'heart' : 'heart-outline'}
            label={item.likes}
            onPress={onToggleLike}
            active={item.liked}
            activeColor="#FF3B6B"
          />
          <View style={styles.sidebarDivider} />
          <ActionBtn
            icon="chatbubble-ellipses-outline"
            label={item.comments}
          />
          <View style={styles.sidebarDivider} />
          <ActionBtn
            icon={item.saved ? 'bookmark' : 'bookmark-outline'}
            label="Save"
            onPress={onToggleSave}
            active={item.saved}
            activeColor="#06B6D4"
          />
          <View style={styles.sidebarDivider} />
          <ActionBtn
            icon="paper-plane-outline"
            label="Share"
          />
        </GlassView>

        {/* Rotating music disc */}
        <MotiView
          from={{ rotate: '0deg' }}
          animate={{ rotate: '360deg' }}
          transition={{ type: 'timing', duration: 7000, loop: true }}
          style={styles.discWrap}
        >
          <GlassView style={styles.disc} intensity={24}>
            <LinearGradient colors={['#FF3B6B', '#8B5CF6']} style={StyleSheet.absoluteFill} />
            <Ionicons name="musical-notes" size={14} color="#fff" />
          </GlassView>
        </MotiView>
      </View>

      {/* ── BOTTOM INFO — glass card ── */}
      <View style={styles.infoWrap}>
        <GlassView style={styles.infoCard} intensity={26}>

          {/* Creator row */}
          <View style={styles.creatorRow}>
            <LinearGradient colors={['#FF3B6B', '#8B5CF6']} style={styles.avatarRing}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarText}>{item.avatar}</Text>
              </View>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.creatorName}>{item.creator}</Text>
              <Text style={styles.creatorHandle}>{item.handle}</Text>
            </View>
            <GlassView style={styles.followPill} intensity={14}>
              <Text style={styles.followText}>+ Follow</Text>
            </GlassView>
          </View>

          {/* Title */}
          <Text style={styles.reelTitle} numberOfLines={2}>{item.title}</Text>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <View style={styles.tagRow}>
              {item.tags.slice(0, 4).map((t) => (
                <GlassView key={t} style={styles.tagChip} intensity={10}>
                  <Text style={styles.tagText}>#{t}</Text>
                </GlassView>
              ))}
            </View>
          )}
        </GlassView>
      </View>

      {/* ── PROGRESS BAR — glowing accent line ── */}
      <View style={styles.progressTrack}>
        {isActive && !paused && (
          <MotiView
            from={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ type: 'timing', duration: 14000, loop: true }}
            style={styles.progressFill}
          />
        )}
      </View>

      {/* ── DOUBLE-TAP HEART BURST ── */}
      <AnimatePresence>
        {showHeart && (
          <MotiView
            from={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1.3 }}
            exit={{ opacity: 0, scale: 1.9 }}
            transition={{ type: 'spring', damping: 14 }}
            style={styles.heartOverlay}
            pointerEvents="none"
          >
            <Ionicons name="heart" size={160} color="#FF3B6B" />
          </MotiView>
        )}
      </AnimatePresence>

      {/* ── PAUSE ICON ── */}
      <AnimatePresence>
        {showPauseIcon && paused && (
          <MotiView
            from={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ type: 'timing', duration: 300 }}
            style={styles.pauseOverlay}
            pointerEvents="none"
          >
            <GlassView style={styles.pausePill} intensity={30}>
              <Ionicons name="play" size={40} color="#fff" />
            </GlassView>
          </MotiView>
        )}
      </AnimatePresence>

    </Pressable>
  );
}

export default function ReelsScreen() {
  const { reels, toggleLike, toggleSave } = useApp();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [containerH, setContainerH] = useState(SCREEN_H);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 70 }).current;

  const renderItem = useCallback(
    ({ item, index }) => (
      <ReelItem
        item={item}
        isActive={index === activeIndex}
        height={containerH}
        topInset={insets.top}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        onToggleLike={() => toggleLike(item.id)}
        onToggleSave={() => toggleSave(item.id)}
      />
    ),
    [activeIndex, containerH, insets.top, muted, toggleLike, toggleSave]
  );

  return (
    <View style={styles.root} onLayout={(e) => setContainerH(e.nativeEvent.layout.height)}>
      <StatusBar style="light" />
      <FlatList
        data={reels}
        keyExtractor={(r) => r.id}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={containerH}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        getItemLayout={(_, i) => ({ length: containerH, offset: containerH * i, index: i })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  reel: { backgroundColor: '#000', overflow: 'hidden' },

  videoCrop: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  videoInner: { justifyContent: 'center', alignItems: 'center' },
  hlsVideo: { width: '100%', height: '100%' },

  topShade: { position: 'absolute', left: 0, right: 0, top: 0, height: 160 },
  bottomShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 320 },

  /* Top bar */
  topBar: {
    position: 'absolute', left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  brandPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  brandAccentLine: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
    borderTopLeftRadius: radius.pill, borderBottomLeftRadius: radius.pill,
  },
  reelsBrand: {
    color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: -0.8,
    marginLeft: 6,
  },
  muteChip: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },

  /* Sidebar */
  sidebar: {
    position: 'absolute', right: 12, bottom: 180,
    alignItems: 'center', gap: 14,
  },
  sidebarPill: {
    borderRadius: radius.xxl,
    paddingVertical: 8, paddingHorizontal: 2,
    alignItems: 'center', gap: 0,
    overflow: 'hidden',
  },
  actionBtn: {
    alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, gap: 3,
  },
  actionLabel: { color: 'rgba(255,255,255,0.82)', fontSize: 10, fontWeight: '700' },
  sidebarDivider: {
    width: '70%', height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  discWrap: { marginTop: 4 },
  disc: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },

  /* Bottom info card */
  infoWrap: {
    position: 'absolute', left: spacing.md, right: 70, bottom: 54,
  },
  infoCard: {
    borderRadius: radius.xl,
    paddingHorizontal: 14, paddingVertical: 12,
    gap: 8,
    overflow: 'hidden',
  },
  creatorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarRing: { padding: 2, borderRadius: 24 },
  avatarInner: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 13 },
  creatorName: { color: '#fff', fontWeight: '800', fontSize: 13, letterSpacing: -0.2 },
  creatorHandle: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
  followPill: {
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: radius.pill,
  },
  followText: { color: '#fff', fontWeight: '800', fontSize: 11, letterSpacing: 0.4 },

  reelTitle: {
    color: '#fff', fontSize: 13, lineHeight: 18,
    fontWeight: '600', letterSpacing: -0.1,
  },

  tagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tagChip: {
    paddingHorizontal: 9, paddingVertical: 4,
    borderRadius: radius.pill,
  },
  tagText: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '700' },

  /* Progress */
  progressTrack: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    height: 2.5, backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },

  /* Overlays */
  heartOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  pauseOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  pausePill: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center',
  },
});
