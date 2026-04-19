import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius } from '../constants/theme';

export default function GlassCard({
  children,
  style,
  intensity = 38,
  tint = 'dark',
  radiusSize = radius.xl,
  bordered = true,
}) {
  const useBlur = Platform.OS !== 'web';

  return (
    <View style={[styles.wrapper, { borderRadius: radiusSize }, bordered && styles.bordered, style]}>
      {useBlur ? (
        <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.webGlass]} />
      )}
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { overflow: 'hidden', backgroundColor: colors.card },
  bordered: { borderWidth: 1, borderColor: colors.border },
  webGlass: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(8px) saturate(1.15)',
    WebkitBackdropFilter: 'blur(8px) saturate(1.15)',
  },
});
