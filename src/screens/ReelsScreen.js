import React, { useCallback, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Dimensions,
  Pressable, Image, Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView, AnimatePresence } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import HlsVideoPlayer from '../components/HlsVideoPlayer';
import { colors, spacing, radius } from '../constants/theme';
import { useApp } from '../context/AppContext';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');
const GLASS_BORDER = 'rgba(255,255,255,0.16)';
const IS_WEB = Platform.OS === 'web';

/* ─── Glass primitive ─────────────────────────────────────────────── */
function GlassView({ style, intensity = 22, children }) {
  if (IS_WEB) {
    return (
      <View
        style={[
          {
            backgroundColor: 'rgba(10,10,20,0.54)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderColor: GLASS_BORDER,
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
      style={[{ borderColor: GLASS_BORDER, borderWidth: 1, overflow: 'hidden' }, style]}
    >
      {children}
    </BlurView>
  );
}

/* ─── Platform-aware video ─────────────────────────────────────────── */
function VideoLayer({ youtubeId, hlsUrl, isActive, paused, muted, height }) {
  if (!isActive) return null;

  /* Web: raw <iframe> with autoplay+mute; overscan hides YouTube chrome */
  if (IS_WEB) {
    const src =
      `https://www.youtube.com/embed/${youtubeId}` +
      `?autoplay=1&mute=1&controls=0&showinfo=0&rel=0` +
      `&modestbranding=1&loop=1&playlist=${youtubeId}` +
      `&playsinline=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0`;
    return (
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          overflow: 'hidden',
        }}
      >
        <iframe
          key={youtubeId}
          src={src}
          style={{
            position: 'absolute',
            top: '-80px',
            left: '-2px',
            width: 'calc(100% + 4px)',
            height: 'calc(100% + 160px)',
            border: 'none',
            pointerEvents: 'none',
          }}
          allow="autoplay; encrypted-media; fullscreen"
          title="reel"
        />
      </div>
    );
  }

  /* Native: HLS preferred, YouTube fallback */
  if (hlsUrl) {
    return (
      <HlsVideoPlayer
        hlsUrl={hlsUrl}
        muted={muted}
        shouldPlay={!paused}
        style={{ width: SCREEN_W, height }}
      />
    );
  }
  return (
    <YoutubePlayer
      height={height}
      width={SCREEN_W}
      videoId={youtubeId}
      play={!paused}
      mute={muted}
      webViewProps={{
        allowsInlineMediaPlayback: true,
        mediaPlaybackRequiresUserAction: false,
      }}
      initialPlayerParams={{
        controls: false,
        modestbranding: true,
        loop: true,
        preventFullScreen: true,
        showClosedCaptions: false,
        rel: false,
      }}
    />
  );
}

/* ─── Single action button ─────────────────────────────────────────── */
function ActionBtn({ icon, count, onPress, active = false, activeColor = '#FF3B6B' }) {
  return (
    <Pressable onPress={onPress} style={S.actionBtn}>
      <GlassView style={S.actionCircle} intensity={24}>
        <MotiView
          animate={{ scale: active ? 1.22 : 1 }}
          transition={{ type: 'spring', damping: 9, stiffness: 200 }}
        >
          <Ionicons
            name={icon}
            size={23}
            color={active ? activeColor : '#fff'}
          />
        </MotiView>
      </GlassView>
      {count != null && (
        <Text style={[S.actionCount, active && { color: activeColor }]}>
          {count}
        </Text>
      )}
    </Pressable>
  );
}

/* ─── Reel item ────────────────────────────────────────────────────── */
function ReelItem({
  item, isActive, index, height, topInset, bottomInset,
  muted, onToggleMute, onToggleLike, onToggleSave,
}) {
  const [paused, setPaused] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const lastTap = useRef(0);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 270) {
      if (!item.liked) onToggleLike();
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 850);
    } else {
      const next = !paused;
      setPaused(next);
      if (next) {
        setShowPause(true);
        setTimeout(() => setShowPause(false), 700);
      }
    }
    lastTap.current = now;
  };

  const poster = item.posterUrl
    || `https://i.ytimg.com/vi/${item.youtubeId}/maxresdefault.jpg`;

  const sidebarBottom = bottomInset + 130;
  const infoBottom   = bottomInset + 12;

  return (
    <Pressable onPress={handleTap} style={[S.reel, { height, width: SCREEN_W }]}>

      {/* ── Ambient blurred bg ── */}
      <Image source={{ uri: poster }} style={StyleSheet.absoluteFill} blurRadius={30} resizeMode="cover" />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.42)' }]} />

      {/* ── Video (full viewport) ── */}
      <View style={StyleSheet.absoluteFill}>
        <VideoLayer
          youtubeId={item.youtubeId}
          hlsUrl={item.hlsUrl}
          isActive={isActive}
          paused={paused}
          muted={muted}
          height={height}
        />
      </View>

      {/* ── Top gradient ── */}
      <LinearGradient
        colors={['rgba(0,0,0,0.78)', 'rgba(0,0,0,0.3)', 'transparent']}
        locations={[0, 0.35, 1]}
        style={S.topShade}
      />

      {/* ── Bottom gradient ── */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.94)']}
        locations={[0, 0.45, 1]}
        style={S.bottomShade}
      />

      {/* ── TOP BAR ── */}
      <View style={[S.topBar, { paddingTop: Math.max(14, topInset + 8) }]}>
        <GlassView style={S.brandPill} intensity={26}>
          <LinearGradient
            colors={['#FF3B6B', '#8B5CF6']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={S.brandStripe}
          />
          <Text style={S.brandText}>Reels</Text>
        </GlassView>
        <View style={S.topRight}>
          <GlassView style={S.numChip} intensity={22}>
            <Text style={S.numText}>{index + 1}</Text>
          </GlassView>
          <Pressable onPress={onToggleMute}>
            <GlassView style={S.iconChip} intensity={22}>
              <Ionicons
                name={muted ? 'volume-mute' : 'volume-high'}
                size={14}
                color="rgba(255,255,255,0.9)"
              />
            </GlassView>
          </Pressable>
        </View>
      </View>

      {/* ── RIGHT ACTION COLUMN ── */}
      <View style={[S.actionCol, { bottom: sidebarBottom }]}>
        <ActionBtn
          icon={item.liked ? 'heart' : 'heart-outline'}
          count={item.likes}
          onPress={onToggleLike}
          active={item.liked}
          activeColor="#FF3B6B"
        />
        <ActionBtn
          icon="chatbubble-ellipses-outline"
          count={item.comments}
        />
        <ActionBtn
          icon={item.saved ? 'bookmark' : 'bookmark-outline'}
          count="Save"
          onPress={onToggleSave}
          active={item.saved}
          activeColor="#06B6D4"
        />
        <ActionBtn
          icon="paper-plane-outline"
          count="Share"
        />
        {/* Music disc */}
        <MotiView
          from={{ rotate: '0deg' }}
          animate={{ rotate: '360deg' }}
          transition={{ type: 'timing', duration: 8000, loop: true }}
          style={{ marginTop: 6 }}
        >
          <GlassView style={S.disc} intensity={26}>
            <LinearGradient colors={['#FF3B6B', '#8B5CF6']} style={StyleSheet.absoluteFill} />
            <Ionicons name="musical-notes" size={13} color="#fff" />
          </GlassView>
        </MotiView>
      </View>

      {/* ── BOTTOM INFO ── */}
      <View style={[S.infoArea, { bottom: infoBottom }]}>
        {/* Creator row */}
        <View style={S.creatorRow}>
          <View style={S.avatarWrap}>
            <LinearGradient colors={['#FF3B6B', '#8B5CF6']} style={S.avatarRing}>
              <View style={S.avatarInner}>
                <Text style={S.avatarText}>{item.avatar}</Text>
              </View>
            </LinearGradient>
            <View style={S.onlineDot} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={S.creatorName}>{item.creator}</Text>
            <Text style={S.creatorHandle}>{item.handle}</Text>
          </View>
          <LinearGradient
            colors={['#FF3B6B', '#8B5CF6']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={S.followBtn}
          >
            <Text style={S.followText}>Follow</Text>
          </LinearGradient>
        </View>

        {/* Title */}
        <Text style={S.title} numberOfLines={2}>{item.title}</Text>

        {/* Tags */}
        {item.tags?.length > 0 && (
          <View style={S.tagRow}>
            {item.tags.slice(0, 3).map((t) => (
              <GlassView key={t} style={S.tagChip} intensity={10}>
                <Text style={S.tagText}>#{t}</Text>
              </GlassView>
            ))}
          </View>
        )}

        {/* Music ticker */}
        <View style={S.musicRow}>
          <Ionicons name="musical-note" size={11} color="rgba(255,255,255,0.55)" />
          <Text style={S.musicText} numberOfLines={1}>
            Original AI Sound · {item.creator}
          </Text>
        </View>
      </View>

      {/* ── PROGRESS BAR ── */}
      <View style={S.progressTrack}>
        {isActive && !paused && (
          <MotiView
            from={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ type: 'timing', duration: 15000, loop: true }}
            style={S.progressFill}
          />
        )}
      </View>

      {/* ── DOUBLE-TAP HEART ── */}
      <AnimatePresence>
        {showHeart && (
          <MotiView
            from={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1.4 }}
            exit={{ opacity: 0, scale: 2.2 }}
            transition={{ type: 'spring', damping: 11 }}
            style={S.heartOverlay}
            pointerEvents="none"
          >
            <Ionicons name="heart" size={140} color="#FF3B6B" />
          </MotiView>
        )}
      </AnimatePresence>

      {/* ── PAUSE INDICATOR ── */}
      <AnimatePresence>
        {showPause && paused && (
          <MotiView
            from={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ type: 'timing', duration: 240 }}
            style={S.pauseOverlay}
            pointerEvents="none"
          >
            <GlassView style={S.pauseCircle} intensity={32}>
              <Ionicons name="play" size={38} color="#fff" />
            </GlassView>
          </MotiView>
        )}
      </AnimatePresence>

    </Pressable>
  );
}

/* ─── Screen ───────────────────────────────────────────────────────── */
export default function ReelsScreen() {
  const { reels, toggleLike, toggleSave } = useApp();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [containerH, setContainerH] = useState(SCREEN_H);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) setActiveIndex(viewableItems[0].index ?? 0);
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 65 }).current;

  const renderItem = useCallback(
    ({ item, index }) => (
      <ReelItem
        item={item}
        isActive={index === activeIndex}
        index={index}
        height={containerH}
        topInset={insets.top}
        bottomInset={insets.bottom}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        onToggleLike={() => toggleLike(item.id)}
        onToggleSave={() => toggleSave(item.id)}
      />
    ),
    [activeIndex, containerH, insets, muted, toggleLike, toggleSave],
  );

  return (
    <View
      style={S.root}
      onLayout={(e) => setContainerH(e.nativeEvent.layout.height)}
    >
      <StatusBar style="light" hidden />
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

/* ─── Styles ───────────────────────────────────────────────────────── */
const S = StyleSheet.create({
  root:        { flex: 1, backgroundColor: '#000' },
  reel:        { backgroundColor: '#000', overflow: 'hidden' },

  topShade:    { position: 'absolute', left: 0, right: 0, top: 0, height: 180 },
  bottomShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 360 },

  /* Top bar */
  topBar: {
    position: 'absolute', left: 0, right: 0, top: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 8,
  },
  brandPill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 50, overflow: 'hidden', gap: 4,
  },
  brandStripe: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
    borderTopLeftRadius: 50, borderBottomLeftRadius: 50,
  },
  brandText: {
    color: '#fff', fontSize: 16, fontWeight: '900',
    letterSpacing: -0.5, marginLeft: 8,
  },
  topRight:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  numChip: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 50, minWidth: 30, alignItems: 'center',
  },
  numText:   { color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: '700' },
  iconChip: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },

  /* Action column */
  actionCol: {
    position: 'absolute', right: 10,
    alignItems: 'center', gap: 10,
  },
  actionBtn:    { alignItems: 'center', gap: 4 },
  actionCircle: {
    width: 50, height: 50, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },
  actionCount: {
    color: 'rgba(255,255,255,0.85)', fontSize: 10,
    fontWeight: '800', textAlign: 'center',
  },
  disc: {
    width: 46, height: 46, borderRadius: 23,
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.25)',
  },

  /* Info area */
  infoArea: {
    position: 'absolute', left: 14, right: 76,
    gap: 8,
  },
  creatorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarWrap: { position: 'relative' },
  avatarRing: { padding: 2.5, borderRadius: 26 },
  avatarInner: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 11, height: 11, borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.7)',
  },
  avatarText:     { color: '#fff', fontWeight: '900', fontSize: 13 },
  creatorName:    { color: '#fff', fontWeight: '800', fontSize: 14, letterSpacing: -0.3 },
  creatorHandle:  { color: 'rgba(255,255,255,0.45)', fontSize: 11 },
  followBtn: {
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: 50, alignItems: 'center', justifyContent: 'center',
  },
  followText: { color: '#fff', fontWeight: '800', fontSize: 11, letterSpacing: 0.2 },

  title: {
    color: '#fff', fontSize: 14, lineHeight: 20,
    fontWeight: '700', letterSpacing: -0.2,
  },

  tagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tagChip: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 50, overflow: 'hidden',
  },
  tagText: { color: 'rgba(255,255,255,0.75)', fontSize: 10.5, fontWeight: '700' },

  musicRow:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  musicText: { color: 'rgba(255,255,255,0.5)', fontSize: 11, flex: 1 },

  /* Progress */
  progressTrack: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    height: 2.5, backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF3B6B',
    shadowColor: '#FF3B6B',
    shadowOpacity: 0.9, shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },

  /* Overlays */
  heartOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', alignItems: 'center',
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', alignItems: 'center',
  },
  pauseCircle: {
    width: 82, height: 82, borderRadius: 41,
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },
});
