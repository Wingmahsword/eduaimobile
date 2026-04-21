import React from 'react';
import { Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function ScalePressable({
  children,
  onPress,
  style,
  scaleDown = 0.95,
  damping = 20,
  stiffness = 420,
}) {
  const sv = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: sv.value }] }));

  return (
    <Animated.View style={[style, aStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { sv.value = withSpring(scaleDown, { damping, stiffness }); }}
        onPressOut={() => { sv.value = withSpring(1, { damping: 14, stiffness: 260 }); }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
