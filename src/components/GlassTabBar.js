import React from 'react';
import { View, Pressable, StyleSheet, Platform, Text, Easing } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { colors, radius } from '../constants/theme';

const ICONS = {
  Home: 'home',
  Courses: 'book',
  Reels: 'play-circle',
  Playground: 'sparkles',
};

export default function GlassTabBar({ state, descriptors, navigation }) {
  const useBlur = Platform.OS !== 'web';

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.container}>
        {useBlur ? (
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.webGlass]} />
        )}

        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const onPress = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={styles.tab}
                android_ripple={{ color: 'rgba(0,255,65,0.14)', borderless: true }}
              >
                <MotiView
                  animate={{ scale: isFocused ? 1.12 : 1, translateY: isFocused ? -2 : 0 }}
                  transition={{ type: 'timing', duration: 420, easing: Easing.inOut(Easing.cubic) }}
                  style={styles.iconWrap}
                >
                  <Ionicons
                    name={ICONS[route.name] + (isFocused ? '' : '-outline')}
                    size={22}
                    color={isFocused ? colors.text : colors.textMuted}
                  />
                </MotiView>

                <Text style={[styles.label, { color: isFocused ? colors.text : colors.textMuted }]}>
                  {route.name}
                </Text>

                {isFocused && (
                  <MotiView
                    from={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 360, easing: Easing.inOut(Easing.ease) }}
                    style={styles.activeDot}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  container: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  row: { flexDirection: 'row', paddingVertical: 10 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 6 },
  iconWrap: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginTop: 2 },
  activeDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  webGlass: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(8px) saturate(1.15)',
    WebkitBackdropFilter: 'blur(8px) saturate(1.15)',
  },
});
