import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import ScalePressable from '../components/ScalePressable';
import { spacing, radius, typography } from '../constants/theme';
import { PROMPT_COURSE_MONTHS, LESSON_TYPES } from '../constants/promptCourse';
import { useApp } from '../context/AppContext';

function findLessonById(id) {
  for (const month of PROMPT_COURSE_MONTHS) {
    for (const week of month.weeks) {
      const found = week.lessons.find((l) => l.id === id);
      if (found) return { lesson: found, week, month };
    }
  }
  return null;
}

function findNextLessonId(id) {
  let foundCurrent = false;
  for (const month of PROMPT_COURSE_MONTHS) {
    for (const week of month.weeks) {
      for (const l of week.lessons) {
        if (foundCurrent) return l.id;
        if (l.id === id) foundCurrent = true;
      }
    }
  }
  return null;
}

export default function LessonScreen({ route, navigation }) {
  const { lessonId } = route.params || {};
  const { completedLessons, markLessonComplete } = useApp();

  const ctx = useMemo(() => findLessonById(lessonId), [lessonId]);
  if (!ctx) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <Text style={styles.errorText}>Lesson not found.</Text>
      </SafeAreaView>
    );
  }

  const { lesson, week, month } = ctx;
  const cfg = LESSON_TYPES[lesson.type] || LESSON_TYPES.video;
  const isComplete = completedLessons.includes(lesson.id);

  const onComplete = () => {
    markLessonComplete(lesson.id);
    const next = findNextLessonId(lesson.id);
    if (next) {
      navigation.replace('Lesson', { lessonId: next });
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>Week {week.week} · Month {month.id}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 220 }}
        >
          <View style={styles.header}>
            <View style={[styles.typeChip, { backgroundColor: cfg.accent + '22', borderColor: cfg.accent + '55' }]}>
              <Ionicons name={cfg.icon} size={12} color={cfg.accent} />
              <Text style={[styles.typeChipText, { color: cfg.accent }]}>{cfg.label}</Text>
            </View>
            <Text style={styles.duration}>· {lesson.duration}</Text>
          </View>

          <Text style={styles.title}>{lesson.title}</Text>

          <LinearGradient
            colors={[cfg.accent + '22', cfg.accent + '08']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.previewBox}
          >
            <Text style={styles.previewLabel}>QUICK PREVIEW</Text>
            <Text style={styles.previewText}>{lesson.preview}</Text>
          </LinearGradient>

          <Text style={styles.sectionTitle}>What you'll learn</Text>
          <View style={styles.contentList}>
            {lesson.content.map((item, i) => (
              <View key={i} style={styles.contentItem}>
                <View style={[styles.contentBullet, isComplete && styles.contentBulletDone]}>
                  {isComplete ? (
                    <Ionicons name="checkmark" size={11} color="#5EEAD4" />
                  ) : (
                    <Text style={styles.contentNum}>{i + 1}</Text>
                  )}
                </View>
                <Text style={styles.contentText}>{item}</Text>
              </View>
            ))}
          </View>

          {!isComplete ? (
            <ScalePressable onPress={onComplete} scaleDown={0.96}>
              <LinearGradient
                colors={['#5EEAD4', '#7C6DFA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.completeBtn}
              >
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.completeBtnText}>Mark as complete</Text>
              </LinearGradient>
            </ScalePressable>
          ) : (
            <View style={styles.doneBanner}>
              <Ionicons name="checkmark-circle" size={18} color="#5EEAD4" />
              <Text style={styles.doneBannerText}>Lesson complete</Text>
            </View>
          )}
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.08)' },
  topTitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700', flex: 1, textAlign: 'center', fontFamily: typography.family },

  scroll: { padding: spacing.lg, paddingBottom: 140 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  typeChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, borderWidth: 1 },
  typeChipText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  duration: { color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '700' },

  title: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: -0.4, lineHeight: 26, marginBottom: 16 },

  previewBox: {
    padding: 16, borderRadius: radius.md, marginBottom: 24,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    gap: 6,
  },
  previewLabel: { color: '#5EEAD4', fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  previewText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontStyle: 'italic', lineHeight: 19 },

  sectionTitle: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 0.5, marginBottom: 10 },
  contentList: { gap: 10, marginBottom: 20 },
  contentItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.06)' },
  contentBullet: { width: 22, height: 22, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  contentBulletDone: { backgroundColor: 'rgba(94,234,212,0.15)' },
  contentNum: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '900' },
  contentText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 19, flex: 1 },

  completeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: radius.pill },
  completeBtnText: { color: '#fff', fontSize: 14, fontWeight: '900' },

  doneBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: radius.pill,
    backgroundColor: 'rgba(94,234,212,0.12)', borderWidth: 1, borderColor: 'rgba(94,234,212,0.32)',
  },
  doneBannerText: { color: '#5EEAD4', fontSize: 13, fontWeight: '900' },

  errorText: { color: '#fff', textAlign: 'center', padding: 32 },
});
