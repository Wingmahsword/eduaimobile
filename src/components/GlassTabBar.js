import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { MotiView } from 'moti';
import { radius } from '../constants/theme';

const ICONS = {
  Home: 'home',
  Courses: 'compass',
  Reels: 'play-circle',
  Playground: 'sparkles',
};

function TabButton({ route, isFocused, onPress }) {
  const sv = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: sv.value }] }));
  const iconName = (ICONS[route.name] ?? 'ellipse') + (isFocused ? '' : '-outline');

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { sv.value = withSpring(0.8, { damping: 14, stiffness: 460 }); }}
      onPressOut={() => { sv.value = withSpring(1, { damping: 10, stiffness: 280 }); }}
      style={styles.tab}
    >
      <Animated.View style={[styles.iconBox, aStyle]}>
        {isFocused && (
          <MotiView
            from={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 16, stiffness: 280 }}
            style={styles.activeBg}
          />
        )}
        <Ionicons
          name={iconName}
          size={isFocused ? 25 : 23}
          color={isFocused ? '#ffffff' : 'rgba(255,255,255,0.38)'}
        />
      </Animated.View>
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
      <View style={styles.pill}>
        {useBlur ? (
          <BlurView intensity={65} tint="dark" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.webFill]} />
        )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    paddingHorizontal: 18,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
  },
  pill: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  row: { flexDirection: 'row', paddingVertical: 8 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, gap: 5 },
  iconBox: { width: 48, height: 38, alignItems: 'center', justifyContent: 'center' },
  activeBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.11)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  activeDot: { width: 18, height: 3, borderRadius: 1.5, backgroundColor: '#ffffff' },
  webFill: {
    backgroundColor: 'rgba(0,0,0,0.88)',
    backdropFilter: 'blur(24px) saturate(1.5)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
  },
});
