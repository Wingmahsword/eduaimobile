import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Pressable, Image, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import HlsVideoPlayer from '../components/HlsVideoPlayer';
import { colors, spacing, radius, typography } from '../constants/theme';
import { useApp } from '../context/AppContext';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');

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
      setTimeout(() => setShowPauseIcon(false), 600);
    }
    lastTapRef.current = now;
  };

  return (
    <Pressable onPress={handlePress} style={[styles.reel, { height, width: SCREEN_W }]}>
      {/* Blurred poster fallback */}
      <Image
        source={{ uri: item.posterUrl || `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg` }}
        style={StyleSheet.absoluteFill}
        blurRadius={24}
        resizeMode="cover"
      />

      {/* Video */}
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
                webViewProps={{
                  allowsInlineMediaPlayback: true,
                  mediaPlaybackRequiresUserAction: false,
                }}
                initialPlayerParams={{
                  controls: false,
                  modestbranding: true,
                  loop: true,
                  playerLang: 'en',
                  preventFullScreen: true,
                  showClosedCaptions: false,
                  rel: false,
                }}
              />
            )}
          </View>
        )}
      </View>

      {/* Top gradient */}
      <LinearGradient
        colors={["rgba(19,24,45,0.5)", "rgba(19,24,45,0)"]}
        style={styles.topShade}
      />
      {/* Bottom gradient */}
      <LinearGradient
        colors={["rgba(12,15,30,0)", "rgba(12,15,30,0.9)"]}
        style={styles.bottomShade}
      />

      {/* Top bar */}
      <View style={[styles.topBar, { top: Math.max(18, topInset + 8) }]}>
        <Text style={styles.reelsBrand}>Reels</Text>
        <Pressable onPress={onToggleMute} style={styles.muteBtn}>
          <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={18} color="#fff" />
        </Pressable>
      </View>

      {/* Right sidebar actions */}
      <View style={styles.sidebar}>
        <Pressable style={styles.sideBtn} onPress={onToggleLike}>
          <MotiView animate={{ scale: item.liked ? 1.15 : 1 }} transition={{ type: 'spring', damping: 10 }}>
            <Ionicons name={item.liked ? 'heart' : 'heart-outline'} size={32} color={item.liked ? '#ff3b6b' : '#fff'} />
          </MotiView>
          <Text style={styles.sideText}>{item.likes}</Text>
        </Pressable>
        <View style={styles.sideBtn}>
          <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
          <Text style={styles.sideText}>{item.comments}</Text>
        </View>
        <Pressable style={styles.sideBtn} onPress={onToggleSave}>
          <Ionicons name={item.saved ? 'bookmark' : 'bookmark-outline'} size={28} color="#fff" />
          <Text style={styles.sideText}>Save</Text>
        </Pressable>
        <View style={styles.sideBtn}>
          <Ionicons name="paper-plane-outline" size={26} color="#fff" />
          <Text style={styles.sideText}>Share</Text>
        </View>

        <MotiView
          from={{ rotate: '0deg' }}
          animate={{ rotate: '360deg' }}
          transition={{ type: 'timing', duration: 8000, loop: true }}
          style={styles.audioDisc}
        >
          <Ionicons name="musical-notes" size={16} color={colors.accent} />
        </MotiView>
      </View>

      {/* Bottom info */}
      <View style={styles.info}>
        <View style={styles.creatorRow}>
          <LinearGradient colors={["#FF3B6B", "#7C3AED"]} style={styles.avatarRing}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{item.avatar}</Text></View>
          </LinearGradient>
          <View>
            <Text style={styles.creator}>{item.creator}</Text>
            <Text style={styles.handle}>{item.handle}</Text>
          </View>
          <Pressable style={styles.followBtn}>
            <Text style={styles.followText}>Follow</Text>
          </Pressable>
        </View>
        <Text style={styles.reelTitle}>{item.title}</Text>
        <View style={styles.tagRow}>
          {item.tags?.map((t) => (
            <Text key={t} style={styles.tag}>#{t}</Text>
          ))}
        </View>
      </View>

      {/* Double tap heart burst */}
      <AnimatePresence>
        {showHeart && (
          <MotiView
            from={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1.4 }}
            exit={{ opacity: 0, scale: 1.8 }}
            transition={{ type: 'timing', duration: 420 }}
            style={styles.heartOverlay}
            pointerEvents="none"
          >
            <Ionicons name="heart" size={140} color="#ff3b6b" />
          </MotiView>
        )}
      </AnimatePresence>

      {/* Pause overlay */}
      <AnimatePresence>
        {showPauseIcon && paused && (
          <MotiView
            from={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ type: 'timing', duration: 360 }}
            style={styles.pauseOverlay}
            pointerEvents="none"
          >
            <Ionicons name="play" size={80} color="rgba(255,255,255,0.9)" />
          </MotiView>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      {isActive && !paused && (
        <View style={styles.progressWrap}>
          <MotiView
            from={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ type: 'timing', duration: 12000, loop: true }}
            style={styles.progressFill}
          />
        </View>
      )}
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
    if (viewableItems && viewableItems.length > 0) {
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  reel: { backgroundColor: '#000', overflow: 'hidden' },
  videoCrop: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  videoInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hlsVideo: {
    width: '100%',
    height: '100%',
  },
  topShade: { position: 'absolute', left: 0, right: 0, top: 0, height: 120 },
  bottomShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 260 },
  topBar: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg },
  reelsBrand: { color: '#fff', fontSize: 24, fontWeight: typography.heavy, letterSpacing: -1.1, fontFamily: typography.family },
  muteBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.42)' },
  sidebar: { position: 'absolute', right: 12, bottom: 160, gap: spacing.lg, alignItems: 'center' },
  sideBtn: { alignItems: 'center', gap: 4 },
  sideText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  audioDisc: { marginTop: spacing.sm, width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.55)', backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center' },
  info: { position: 'absolute', left: spacing.lg, right: 70, bottom: 58 },
  creatorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  avatarRing: { padding: 2, borderRadius: 22 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.14)', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 12 },
  creator: { color: '#fff', fontWeight: '800', fontSize: 14 },
  handle: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  followBtn: { marginLeft: spacing.sm, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.sm, borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)' },
  followText: { color: '#fff', fontWeight: '800', fontSize: 11, letterSpacing: 1 },
  reelTitle: { color: '#fff', fontSize: 14, marginTop: 4, lineHeight: 19 },
  tagRow: { flexDirection: 'row', gap: spacing.sm, marginTop: 6, flexWrap: 'wrap' },
  tag: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700' },
  heartOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  pauseOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  progressWrap: { position: 'absolute', left: 0, right: 0, bottom: 44, height: 3, backgroundColor: 'rgba(255,255,255,0.24)' },
  progressFill: { height: '100%', backgroundColor: colors.accent },
});
