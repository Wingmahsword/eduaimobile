import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { MotiView } from 'moti';

/* ── Palette (matches global violet/teal system) ─────────────── */
const ACCENT = '#7c6dfa';
const INACTIVE = 'rgba(240,240,255,0.40)';
const ACTIVE_LABEL = '#f0f0ff';

/* ── Icon mapping — lucide-like semantics via Ionicons ───────── */
const ICONS = {
  Home:        { active: 'home',        inactive: 'home-outline' },
  Courses:     { active: 'book',        inactive: 'book-outline' },
  Reels:       { active: 'play',        inactive: 'play-outline' },
  Playground:  { active: 'sparkles',    inactive: 'sparkles-outline' },
  Profile:     { active: 'person-circle', inactive: 'person-circle-outline' },
};

function TabButton({ route, isFocused, onPress }) {
  const sv = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: sv.value }] }));
  const mapping = ICONS[route.name] || { active: 'ellipse', inactive: 'ellipse-outline' };
  const iconName = isFocused ? mapping.active : mapping.inactive;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { sv.value = withSpring(0.85, { damping: 14, stiffness: 460 }); }}
      onPressOut={() => { sv.value = withSpring(1, { damping: 10, stiffness: 280 }); }}
      style={styles.tab}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
    >
      <Animated.View style={[styles.iconBox, aStyle]}>
        <Ionicons
          name={iconName}
          size={22}
          color={isFocused ? ACCENT : INACTIVE}
        />
      </Animated.View>
      <Text style={[styles.label, { color: isFocused ? ACTIVE_LABEL : INACTIVE }]}>
        {route.name}
      </Text>
      {isFocused && (
        <MotiView
          from={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ type: 'spring', damping: 18, stiffness: 320 }}
          style={styles.activeDot}
        />
      )}
    </Pressable>
  );
}

export default function GlassTabBar({ state, navigation }) {
  const useBlur = Platform.OS !== 'web';
  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {useBlur ? (
        <BlurView intensity={26} tint="dark" style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.webFill]} />
      )}
      <View style={styles.topBorder} />
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return <TabButton key={route.key} route={route} isFocused={isFocused} onPress={onPress} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    paddingBottom: Platform.OS === 'ios' ? 22 : 10,
    paddingTop: 6,
    backgroundColor: 'rgba(9,9,16,0.85)',
  },
  topBorder: {
    position: 'absolute', left: 0, right: 0, top: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  row: { flexDirection: 'row' },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    minHeight: 52,              // ≥44px touch target
    gap: 3,
  },
  iconBox: {
    width: 44, height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  activeDot: {
    position: 'absolute', bottom: 2,
    width: 14, height: 2,
    borderRadius: 1,
    backgroundColor: ACCENT,
  },
  webFill: {
    backgroundColor: 'rgba(9,9,16,0.85)',
    backdropFilter: 'blur(20px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
  },
});
