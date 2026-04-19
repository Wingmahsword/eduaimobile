import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CoursesScreen from '../screens/CoursesScreen';
import ReelsScreen from '../screens/ReelsScreen';
import PlaygroundScreen from '../screens/PlaygroundScreen';
import GlassTabBar from '../components/GlassTabBar';

const Tab = createBottomTabNavigator();

export default function RootTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Courses" component={CoursesScreen} />
      <Tab.Screen name="Reels" component={ReelsScreen} />
      <Tab.Screen name="Playground" component={PlaygroundScreen} />
    </Tab.Navigator>
  );
}
