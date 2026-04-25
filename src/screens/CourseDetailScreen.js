import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import ScalePressable from '../components/ScalePressable';
import { spacing, radius, typography } from '../constants/theme';
import {
  PROMPT_COURSE_META,
  PROMPT_COURSE_MONTHS,
  PROMPT_COURSE_QUIZZES,
  PROMPT_COURSE_ACHIEVEMENTS,
  LESSON_TYPES,
} from '../constants/promptCourse';
import { useApp } from '../context/AppContext';

function ProgressRing({ progress }) {
  // pure-RN ring built with two stacked circles + a clipped View arc would be heavy;
  // a simple linear bar inside a card is cleaner here.
  return (
    <View style={styles.ringWrap}>
      <View style={styles.ringTrack}>
        <View style={[styles.ringFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.ringLabel}>{progress}% complete</Text>
    </View>
  );
}

function StatTile({ value, label, icon, color }) {
  return (
    <View style={styles.statTile}>
      <View style={[styles.statIconWrap, { backgroundColor: color + '22', borderColor: color + '44' }]}>
        <Ionicons name={icon} size={14} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function AchievementChip({ a, earned }) {
  return (
    <View style={[styles.achChip, earned ? styles.achChipEarned : styles.achChipLocked]}>
      <Ionicons
        name={earned ? a.icon : 'lock-closed'}
        size={14}
        color={earned ? '#FBBF24' : 'rgba(255,255,255,0.4)'}
      />
      <View style={{ flex: 1 }}>
        <Text style={[styles.achTitle, !earned && { color: 'rgba(255,255,255,0.55)' }]}>{a.title}</Text>
        <Text style={styles.achDesc}>{a.desc}</Text>
      </View>
    </View>
  );
}

function LessonRow({ lesson, completed, onPress }) {
  const cfg = LESSON_TYPES[lesson.type] || LESSON_TYPES.video;
  return (
    <ScalePressable onPress={onPress} scaleDown={0.98}>
      <View style={[styles.lessonRow, completed && styles.lessonRowDone]}>
        <View style={[styles.lessonIcon, { backgroundColor: cfg.accent + '22', borderColor: cfg.accent + '55' }]}>
          <Ionicons name={completed ? 'checkmark' : cfg.icon} size={16} color={completed ? '#5EEAD4' : cfg.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.lessonTitle} numberOfLines={2}>{lesson.title}</Text>
          <View style={styles.lessonMetaRow}>
            <Text style={[styles.lessonMeta, { color: cfg.accent }]}>{cfg.label}</Text>
            <Text style={styles.lessonMeta}>· {lesson.duration}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.4)" />
      </View>
    </ScalePressable>
  );
}

export default function CourseDetailScreen({ navigation }) {
  const { completedLessons, quizScores, enrollCourse, courses } = useApp();
  const [openWeek, setOpenWeek] = useState('1-1');

  const enrolled = useMemo(
    () => courses.find((c) => c.id === PROMPT_COURSE_META.id)?.enrolled,
    [courses],
  );

  const totalLessons = PROMPT_COURSE_META.totalLessons;
  const progress = Math.round((completedLessons.length / totalLessons) * 100);
  const earned = PROMPT_COURSE_ACHIEVEMENTS.filter((a) =>
    a.check({ completedLessons, quizScores }),
  );

  const openLesson = (lesson) => {
    navigation.navigate('Lesson', { lessonId: lesson.id });
  };
  const openQuiz = (quizId) => {
    navigation.navigate('Quiz', { quizId });
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.topTitle}>Course</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 200 }}
        >
          <LinearGradient
            colors={['rgba(124,109,250,0.32)', 'rgba(94,234,212,0.18)', 'rgba(244,114,182,0.18)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroBadgeRow}>
              <View style={styles.heroBadge}>
                <Ionicons name="ribbon" size={11} color="#fff" />
                <Text style={styles.heroBadgeText}>{PROMPT_COURSE_META.badge}</Text>
              </View>
              <Text style={styles.heroPrice}>₹{PROMPT_COURSE_META.price}</Text>
            </View>
            <Text style={styles.heroTitle}>{PROMPT_COURSE_META.title}</Text>
            <Text style={styles.heroSub}>{PROMPT_COURSE_META.subtitle}</Text>

            {enrolled ? (
              <ProgressRing progress={progress} />
            ) : (
              <ScalePressable onPress={() => enrollCourse(PROMPT_COURSE_META.id)} scaleDown={0.96}>
                <LinearGradient
                  colors={['#7C6DFA', '#F472B6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.heroEnroll}
                >
                  <Text style={styles.heroEnrollText}>Enroll Now · ₹149</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </LinearGradient>
              </ScalePressable>
            )}
          </LinearGradient>
        </MotiView>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatTile value={`${completedLessons.length}/${totalLessons}`} label="Lessons" icon="book" color="#7C6DFA" />
          <StatTile value={`${earned.length}/${PROMPT_COURSE_ACHIEVEMENTS.length}`} label="Achievements" icon="ribbon" color="#FBBF24" />
          <StatTile
            value={quizScores.quiz1 != null ? `${quizScores.quiz1}%` : '—'}
            label="Quiz 1"
            icon="flash"
            color="#5EEAD4"
          />
          <StatTile
            value={quizScores.certification != null ? `${quizScores.certification}%` : '🔒'}
            label="Cert"
            icon="trophy"
            color="#F472B6"
          />
        </View>

        {/* Highlights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What you'll get</Text>
          <View style={styles.highlightList}>
            {PROMPT_COURSE_META.highlights.map((h) => (
              <View key={h} style={styles.highlightRow}>
                <Ionicons name="checkmark-circle" size={16} color="#5EEAD4" />
                <Text style={styles.highlightText}>{h}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Curriculum */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Curriculum</Text>
          {PROMPT_COURSE_MONTHS.map((month) => {
            const monthLessons = month.weeks.flatMap((w) => w.lessons);
            const monthDone = monthLessons.filter((l) => completedLessons.includes(l.id)).length;
            return (
              <View key={month.id} style={styles.monthBlock}>
                <View style={[styles.monthHeader, { borderLeftColor: month.color }]}>
                  <Text style={styles.monthEmoji}>{month.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.monthTitle}>Month {month.id}: {month.title}</Text>
                    <Text style={styles.monthMeta}>{monthDone}/{monthLessons.length} lessons completed</Text>
                  </View>
                </View>

                {month.weeks.map((week) => {
                  const wKey = `${month.id}-${week.week}`;
                  const isOpen = openWeek === wKey;
                  const wDone = week.lessons.filter((l) => completedLessons.includes(l.id)).length;
                  return (
                    <View key={wKey} style={styles.weekBlock}>
                      <Pressable
                        onPress={() => setOpenWeek(isOpen ? null : wKey)}
                        style={styles.weekHeader}
                      >
                        <View style={[styles.weekBadge, { backgroundColor: wDone === week.lessons.length ? '#10B981' : 'rgba(255,255,255,0.12)' }]}>
                          <Text style={styles.weekBadgeText}>
                            {wDone === week.lessons.length ? '✓' : `W${week.week}`}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.weekTitle}>Week {week.week}: {week.title}</Text>
                          <Text style={styles.weekMeta}>{wDone}/{week.lessons.length} lessons</Text>
                        </View>
                        <Ionicons
                          name={isOpen ? 'chevron-up' : 'chevron-down'}
                          size={16}
                          color="rgba(255,255,255,0.5)"
                        />
                      </Pressable>
                      {isOpen && (
                        <View style={styles.lessonsList}>
                          {week.lessons.map((l) => (
                            <LessonRow
                              key={l.id}
                              lesson={l}
                              completed={completedLessons.includes(l.id)}
                              onPress={() => openLesson(l)}
                            />
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}

                {month.quizAfter && (
                  <ScalePressable onPress={() => openQuiz(month.quizAfter)} scaleDown={0.97}>
                    <View style={styles.quizBanner}>
                      <View style={styles.quizBannerLeft}>
                        <Ionicons name="game-controller" size={20} color="#7C6DFA" />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.quizBannerTitle}>{month.quizTitle}</Text>
                          <Text style={styles.quizBannerSub}>10 questions · pass with 60%</Text>
                        </View>
                      </View>
                      <Text style={styles.quizBannerScore}>
                        {quizScores[month.quizAfter] != null
                          ? `${quizScores[month.quizAfter]}% ✓`
                          : 'Start →'}
                      </Text>
                    </View>
                  </ScalePressable>
                )}
              </View>
            );
          })}

          {/* Final cert */}
          <ScalePressable onPress={() => openQuiz('certification')} scaleDown={0.97}>
            <LinearGradient
              colors={['#F59E0B', '#EF4444', '#7C6DFA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.certWrap}
            >
              <View style={styles.certInner}>
                <Ionicons name="trophy" size={26} color="#FBBF24" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.certTitle}>Certification Exam</Text>
                  <Text style={styles.certSub}>50 questions · Pass: 70% · Job Guarantee: 89%+</Text>
                </View>
                <Text style={styles.certScore}>
                  {quizScores.certification != null ? `${quizScores.certification}%` : '🔒'}
                </Text>
              </View>
            </LinearGradient>
          </ScalePressable>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievement tracker</Text>
          <View style={styles.achGrid}>
            {PROMPT_COURSE_ACHIEVEMENTS.map((a) => (
              <AchievementChip
                key={a.id}
                a={a}
                earned={earned.some((e) => e.id === a.id)}
              />
            ))}
          </View>
        </View>
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
  topTitle: { color: '#fff', fontSize: 14, fontWeight: '700', fontFamily: typography.family },

  scroll: { paddingBottom: 140 },

  hero: {
    margin: spacing.lg, marginBottom: 12,
    padding: 18, borderRadius: radius.xl, gap: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  heroBadgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill,
    backgroundColor: 'rgba(124,109,250,0.4)', borderWidth: 1, borderColor: 'rgba(124,109,250,0.65)',
  },
  heroBadgeText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  heroPrice: { color: '#5EEAD4', fontSize: 18, fontWeight: '900' },

  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: -0.5, lineHeight: 26 },
  heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 17 },

  heroEnroll: {
    marginTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 13, borderRadius: radius.pill,
  },
  heroEnrollText: { color: '#fff', fontSize: 14, fontWeight: '900' },

  ringWrap: { gap: 6, marginTop: 4 },
  ringTrack: { height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  ringFill: { height: '100%', backgroundColor: '#5EEAD4' },
  ringLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '700' },

  statsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: spacing.lg, marginBottom: 4 },
  statTile: {
    flex: 1, padding: 10, borderRadius: radius.md, gap: 4,
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'flex-start',
  },
  statIconWrap: { width: 24, height: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  statValue: { color: '#fff', fontSize: 14, fontWeight: '900' },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },

  section: { paddingHorizontal: spacing.lg, marginTop: 22 },
  sectionTitle: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 0.4, marginBottom: 12 },

  highlightList: { gap: 8 },
  highlightRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  highlightText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, flex: 1 },

  monthBlock: { marginBottom: 18 },
  monthHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12, borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.04)', borderLeftWidth: 3,
    marginBottom: 8,
  },
  monthEmoji: { fontSize: 20 },
  monthTitle: { color: '#fff', fontSize: 14, fontWeight: '900' },
  monthMeta: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 },

  weekBlock: { marginBottom: 6 },
  weekHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12, borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  weekBadge: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  weekBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  weekTitle: { color: '#fff', fontSize: 13, fontWeight: '700' },
  weekMeta: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2 },

  lessonsList: { gap: 6, paddingTop: 6, paddingLeft: 10 },
  lessonRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 10, borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  lessonRowDone: { backgroundColor: 'rgba(94,234,212,0.06)', borderColor: 'rgba(94,234,212,0.2)' },
  lessonIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  lessonTitle: { color: '#fff', fontSize: 12, fontWeight: '700', lineHeight: 16 },
  lessonMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  lessonMeta: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.5)' },

  quizBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14, borderRadius: radius.md, marginTop: 8,
    backgroundColor: 'rgba(124,109,250,0.12)',
    borderWidth: 1, borderColor: 'rgba(124,109,250,0.32)',
  },
  quizBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  quizBannerTitle: { color: '#fff', fontSize: 12, fontWeight: '800' },
  quizBannerSub: { color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: 2 },
  quizBannerScore: { color: '#7C6DFA', fontSize: 13, fontWeight: '900' },

  certWrap: { padding: 2, borderRadius: radius.lg, marginTop: 14 },
  certInner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: radius.lg,
    backgroundColor: '#0a0a0f',
  },
  certTitle: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
  certSub: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 2 },
  certScore: { color: '#FBBF24', fontSize: 16, fontWeight: '900' },

  achGrid: { gap: 6 },
  achChip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 10, borderRadius: radius.md, borderWidth: 1,
  },
  achChipEarned: {
    backgroundColor: 'rgba(251,191,36,0.08)',
    borderColor: 'rgba(251,191,36,0.32)',
  },
  achChipLocked: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  achTitle: { color: '#fff', fontSize: 12, fontWeight: '800' },
  achDesc: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 1 },
});
