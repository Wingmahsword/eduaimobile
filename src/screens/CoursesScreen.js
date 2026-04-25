import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Pressable, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import GlassCard from '../components/GlassCard';
import ScalePressable from '../components/ScalePressable';
import { colors, spacing, radius, typography } from '../constants/theme';
import { CATEGORIES } from '../constants/data';
import { PROMPT_COURSE_ID } from '../constants/promptCourse';
import { useApp } from '../context/AppContext';

function FeaturedCourseHero({ course, onPress, onEnroll, progress }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 18, stiffness: 200 }}
    >
      <ScalePressable onPress={onPress} scaleDown={0.985}>
        <LinearGradient
          colors={['rgba(124,109,250,0.32)', 'rgba(94,234,212,0.20)', 'rgba(244,114,182,0.18)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featuredCard}
        >
          <View style={styles.featuredBadgeRow}>
            <View style={styles.featuredBadge}>
              <Ionicons name="sparkles" size={11} color="#fff" />
              <Text style={styles.featuredBadgeText}>FEATURED · NEW</Text>
            </View>
            <View style={styles.certBadge}>
              <Ionicons name="trophy" size={11} color="#FBBF24" />
              <Text style={styles.certBadgeText}>{course.badge}</Text>
            </View>
          </View>

          <Text style={styles.featuredTitle}>{course.title}</Text>
          <Text style={styles.featuredSub}>{course.subtitle}</Text>

          <View style={styles.featuredStats}>
            <View style={styles.featuredStat}>
              <Text style={styles.featuredStatNum}>48</Text>
              <Text style={styles.featuredStatLabel}>Lessons</Text>
            </View>
            <View style={styles.featuredStatDivider} />
            <View style={styles.featuredStat}>
              <Text style={styles.featuredStatNum}>12</Text>
              <Text style={styles.featuredStatLabel}>Weeks</Text>
            </View>
            <View style={styles.featuredStatDivider} />
            <View style={styles.featuredStat}>
              <Text style={styles.featuredStatNum}>2+1</Text>
              <Text style={styles.featuredStatLabel}>Quiz/Cert</Text>
            </View>
          </View>

          <View style={styles.featuredFooter}>
            <View style={styles.priceBlock}>
              <Text style={styles.priceOriginal}>₹{course.originalPrice}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceCurrent}>₹{course.price}</Text>
                <View style={styles.discountChip}>
                  <Text style={styles.discountText}>98% OFF</Text>
                </View>
              </View>
            </View>
            <ScalePressable onPress={course.enrolled ? onPress : onEnroll} scaleDown={0.92}>
              <LinearGradient
                colors={course.enrolled ? ['#5EEAD4', '#7C6DFA'] : ['#7C6DFA', '#F472B6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.enrollButton}
              >
                <Text style={styles.enrollButtonText}>
                  {course.enrolled ? 'Continue Learning' : 'Enroll · ₹149'}
                </Text>
                <Ionicons name="arrow-forward" size={14} color="#fff" />
              </LinearGradient>
            </ScalePressable>
          </View>

          {course.enrolled && (
            <View style={styles.progressRow}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressLabel}>{progress}% complete</Text>
            </View>
          )}

          <View style={styles.guaranteeRow}>
            <Ionicons name="shield-checkmark" size={13} color="#5EEAD4" />
            <Text style={styles.guaranteeText}>{course.jobGuarantee}</Text>
          </View>
        </LinearGradient>
      </ScalePressable>
    </MotiView>
  );
}

function CourseCard({ course, index, onPress }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 14 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 18, stiffness: 220, delay: 60 + index * 30 }}
    >
      <ScalePressable onPress={onPress} scaleDown={0.97}>
        <GlassCard radiusSize={radius.lg} style={styles.courseCard}>
          <View style={styles.courseCardTop}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{course.category}</Text>
            </View>
            <Text style={styles.coursePrice}>₹{course.price}</Text>
          </View>
          <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
          <Text style={styles.courseInstructor} numberOfLines={1}>{course.instructor}</Text>
          <View style={styles.courseMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="bar-chart-outline" size={11} color="rgba(255,255,255,0.5)" />
              <Text style={styles.metaText}>{course.level}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={11} color="rgba(255,255,255,0.5)" />
              <Text style={styles.metaText}>{course.duration}</Text>
            </View>
          </View>
        </GlassCard>
      </ScalePressable>
    </MotiView>
  );
}

export default function CoursesScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const { courses, completedLessons, enrollCourse } = useApp();
  const [filter, setFilter] = useState('All');
  const [showFilter, setShowFilter] = useState(false);

  const isCompact = width < 390;
  const featured = useMemo(() => courses.find((c) => c.id === PROMPT_COURSE_ID), [courses]);
  const otherCourses = useMemo(() => {
    const rest = courses.filter((c) => c.id !== PROMPT_COURSE_ID);
    return filter === 'All' ? rest : rest.filter((c) => c.category === filter);
  }, [courses, filter]);

  const progress = featured ? Math.round((completedLessons.length / (featured.totalLessons || 48)) * 100) : 0;

  const goToDetail = () => {
    navigation.navigate('CourseDetail', { courseId: PROMPT_COURSE_ID });
  };

  const handleEnroll = async () => {
    if (!featured.enrolled) await enrollCourse(featured.id);
    goToDetail();
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: isCompact ? spacing.md : spacing.lg }]}>
        <Text style={styles.heading}>Courses</Text>
        <Pressable
          onPress={() => setShowFilter((v) => !v)}
          style={styles.filterBtn}
          hitSlop={10}
        >
          <Ionicons name={showFilter ? 'close' : 'options-outline'} size={20} color="#fff" />
        </Pressable>
      </View>

      {showFilter && (
        <MotiView
          from={{ opacity: 0, translateY: -8 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 180 }}
          style={styles.filterPanel}
        >
          <FlatList
            horizontal
            data={CATEGORIES}
            keyExtractor={(c) => c}
            contentContainerStyle={styles.filterRow}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              const active = item === filter;
              return (
                <ScalePressable
                  onPress={() => { setFilter(item); setShowFilter(false); }}
                  scaleDown={0.92}
                >
                  <View style={[styles.filterChip, active && styles.filterChipActive]}>
                    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{item}</Text>
                  </View>
                </ScalePressable>
              );
            }}
          />
        </MotiView>
      )}

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: isCompact ? spacing.md : spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {featured && (
          <View style={styles.featuredWrap}>
            <FeaturedCourseHero
              course={featured}
              progress={progress}
              onPress={goToDetail}
              onEnroll={handleEnroll}
            />
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>More learning paths</Text>
          {filter !== 'All' && (
            <Pressable onPress={() => setFilter('All')} hitSlop={6}>
              <Text style={styles.clearLink}>Clear filter</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.coursesList}>
          {otherCourses.map((c, i) => (
            <CourseCard
              key={c.id}
              course={c}
              index={i}
              onPress={() => navigation.navigate('Home')}
            />
          ))}
          {otherCourses.length === 0 && (
            <Text style={styles.emptyText}>No courses match this filter yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 4, paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  heading: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: -0.6, fontFamily: typography.family },
  filterBtn: {
    width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },

  filterPanel: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)' },
  filterRow: { paddingHorizontal: spacing.lg, paddingVertical: 12, gap: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  filterChipActive: { backgroundColor: 'rgba(124,109,250,0.28)', borderColor: 'rgba(124,109,250,0.5)' },
  filterChipText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700' },
  filterChipTextActive: { color: '#fff' },

  scrollContent: { paddingTop: 16, paddingBottom: 140 },

  featuredWrap: { marginBottom: 24 },
  featuredCard: {
    borderRadius: radius.xl, padding: 20, gap: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  featuredBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featuredBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill,
    backgroundColor: 'rgba(124,109,250,0.4)',
    borderWidth: 1, borderColor: 'rgba(124,109,250,0.6)',
  },
  featuredBadgeText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  certBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill,
    backgroundColor: 'rgba(251,191,36,0.18)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.35)',
  },
  certBadgeText: { color: '#FBBF24', fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },

  featuredTitle: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: -0.6, lineHeight: 28 },
  featuredSub: { color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 18 },

  featuredStats: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4,
    paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  featuredStat: { flex: 1, alignItems: 'center' },
  featuredStatNum: { color: '#fff', fontSize: 18, fontWeight: '900' },
  featuredStatLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: '700', marginTop: 2, letterSpacing: 0.5 },
  featuredStatDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.12)' },

  featuredFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  priceBlock: { gap: 2 },
  priceOriginal: { color: 'rgba(255,255,255,0.45)', fontSize: 11, textDecorationLine: 'line-through' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priceCurrent: { color: '#fff', fontSize: 22, fontWeight: '900' },
  discountChip: {
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  discountText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  enrollButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 11, borderRadius: radius.pill,
  },
  enrollButtonText: { color: '#fff', fontWeight: '800', fontSize: 13 },

  progressRow: { gap: 6 },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.12)' },
  progressFill: { height: '100%', backgroundColor: '#5EEAD4' },
  progressLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: '700' },

  guaranteeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  guaranteeText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600' },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { color: '#fff', fontSize: 14, fontWeight: '800', letterSpacing: 0.3 },
  clearLink: { color: '#7C6DFA', fontSize: 12, fontWeight: '700' },

  coursesList: { gap: 10 },
  courseCard: { padding: 14, gap: 8 },
  courseCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  categoryPill: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill,
    backgroundColor: 'rgba(124,109,250,0.18)',
    borderWidth: 1, borderColor: 'rgba(124,109,250,0.32)',
  },
  categoryText: { color: '#A28DFB', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  coursePrice: { color: '#5EEAD4', fontSize: 14, fontWeight: '900' },

  courseTitle: { color: '#fff', fontSize: 15, fontWeight: '800', lineHeight: 19 },
  courseInstructor: { color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '600' },
  courseMeta: { flexDirection: 'row', gap: 14, marginTop: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600' },

  emptyText: { color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', paddingVertical: 32 },
});
