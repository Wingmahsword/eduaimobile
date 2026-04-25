import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import ScalePressable from '../components/ScalePressable';
import { spacing, radius, typography } from '../constants/theme';
import { PROMPT_COURSE_QUIZZES } from '../constants/promptCourse';
import { useApp } from '../context/AppContext';

function ResultView({ quiz, score, correct, total, onClose, onRetry }) {
  const passed = score >= quiz.passingScore;
  const jobTier = quiz.jobGuaranteeScore && score >= quiz.jobGuaranteeScore;
  const isCert = quiz.id === 'certification';

  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 18, stiffness: 200 }}
      style={styles.resultRoot}
    >
      <View style={styles.resultEmojiWrap}>
        <Text style={styles.resultEmoji}>{jobTier ? '💼' : passed ? '🎉' : '😅'}</Text>
      </View>
      <Text style={styles.resultTitle}>
        {jobTier ? 'JOB GUARANTEED!' : passed ? 'You passed!' : 'Try again to pass'}
      </Text>
      <Text style={styles.resultScore}>{score}%</Text>
      <Text style={styles.resultDetail}>{correct}/{total} correct</Text>

      {jobTier && (
        <LinearGradient
          colors={['rgba(94,234,212,0.2)', 'rgba(124,109,250,0.2)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.jobBadge}
        >
          <Text style={styles.jobBadgeText}>
            🏆 You qualify for the Job Guarantee Program. Our placement team will reach out within 48 hours.
          </Text>
        </LinearGradient>
      )}

      {passed && !jobTier && isCert && (
        <Text style={styles.resultNote}>You passed! Score 89%+ for the Job Guarantee tier.</Text>
      )}

      {passed && isCert && (
        <View style={styles.certCard}>
          <Text style={styles.certHeading}>CERTIFICATE OF COMPLETION</Text>
          <Text style={styles.certCourse}>Prompt Engineering & Token Mastery</Text>
          <Text style={styles.certLine}>Score: {score}% · {score >= 89 ? 'Distinction' : 'Pass'}</Text>
          <Text style={styles.certLine}>Issued: {new Date().toLocaleDateString()}</Text>
          <View style={styles.certSeal}>
            <Text style={styles.certSealText}>{score >= 89 ? '⭐ DISTINCTION' : '✓ CERTIFIED'}</Text>
          </View>
        </View>
      )}

      <View style={styles.resultActions}>
        {!passed && (
          <ScalePressable onPress={onRetry} scaleDown={0.94}>
            <View style={[styles.resultBtn, styles.resultBtnPrimary]}>
              <Text style={styles.resultBtnTextPrimary}>Retry</Text>
            </View>
          </ScalePressable>
        )}
        <ScalePressable onPress={onClose} scaleDown={0.94}>
          <View style={[styles.resultBtn, styles.resultBtnGhost]}>
            <Text style={styles.resultBtnText}>Back to course</Text>
          </View>
        </ScalePressable>
      </View>
    </MotiView>
  );
}

export default function QuizScreen({ route, navigation }) {
  const { quizId } = route.params || {};
  const quiz = PROMPT_COURSE_QUIZZES[quizId];
  const { submitQuizScore } = useApp();

  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const total = quiz?.questions?.length ?? 0;
  const result = useMemo(() => {
    if (!quiz || !submitted) return null;
    const correct = quiz.questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
    const score = Math.round((correct / total) * 100);
    return { correct, score };
  }, [quiz, submitted, answers, total]);

  if (!quiz) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <Text style={styles.error}>Quiz not found.</Text>
      </SafeAreaView>
    );
  }

  const onSelect = (idx) => {
    setAnswers((p) => ({ ...p, [current]: idx }));
    setTimeout(() => {
      if (current < total - 1) {
        setCurrent((c) => c + 1);
      } else {
        const correct = quiz.questions.reduce((acc, q, i) => acc + ((i === current ? idx : answers[i]) === q.correct ? 1 : 0), 0);
        const score = Math.round((correct / total) * 100);
        submitQuizScore(quiz.id, score);
        setSubmitted(true);
      }
    }, 220);
  };

  const onRetry = () => {
    setAnswers({});
    setCurrent(0);
    setSubmitted(false);
  };

  if (submitted && result) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>
          <Text style={styles.topTitle}>Result</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <ResultView
            quiz={quiz}
            score={result.score}
            correct={result.correct}
            total={total}
            onClose={() => navigation.goBack()}
            onRetry={onRetry}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const q = quiz.questions[current];
  const selected = answers[current];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>{quiz.title.split(':').pop().trim()}</Text>
        <Text style={styles.counter}>{current + 1}/{total}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${((current + 1) / total) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>{quiz.subtitle}</Text>

        <MotiView
          key={current}
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 220 }}
          style={styles.questionCard}
        >
          <Text style={styles.questionText}>{q.q}</Text>
          <View style={styles.optionsList}>
            {q.options.map((opt, i) => {
              const active = selected === i;
              return (
                <ScalePressable key={i} onPress={() => onSelect(i)} scaleDown={0.97}>
                  <View style={[styles.option, active && styles.optionActive]}>
                    <View style={[styles.optionLetter, active && styles.optionLetterActive]}>
                      <Text style={[styles.optionLetterText, active && styles.optionLetterTextActive]}>
                        {String.fromCharCode(65 + i)}
                      </Text>
                    </View>
                    <Text style={[styles.optionText, active && { color: '#fff' }]}>{opt}</Text>
                  </View>
                </ScalePressable>
              );
            })}
          </View>
        </MotiView>

        {Object.keys(answers).length === total && !submitted && (
          <ScalePressable onPress={() => {
            const correct = quiz.questions.reduce((acc, qq, i) => acc + (answers[i] === qq.correct ? 1 : 0), 0);
            const score = Math.round((correct / total) * 100);
            submitQuizScore(quiz.id, score);
            setSubmitted(true);
          }} scaleDown={0.96}>
            <LinearGradient
              colors={['#5EEAD4', '#7C6DFA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitBtn}
            >
              <Text style={styles.submitBtnText}>Submit answers</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </LinearGradient>
          </ScalePressable>
        )}
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
  topTitle: { color: '#fff', fontSize: 13, fontWeight: '700', flex: 1, textAlign: 'center', marginHorizontal: 8, fontFamily: typography.family },
  counter: { color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: '800' },

  progressTrack: { height: 3, backgroundColor: 'rgba(255,255,255,0.08)' },
  progressFill: { height: '100%', backgroundColor: '#7C6DFA' },

  scroll: { padding: spacing.lg, paddingBottom: 140 },

  subtitle: { color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '700', marginBottom: 18, textAlign: 'center' },

  questionCard: {
    padding: 18, borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    gap: 14,
  },
  questionText: { color: '#fff', fontSize: 16, fontWeight: '800', lineHeight: 22 },

  optionsList: { gap: 8 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12, borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  optionActive: { backgroundColor: 'rgba(124,109,250,0.18)', borderColor: 'rgba(124,109,250,0.5)' },
  optionLetter: { width: 24, height: 24, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  optionLetterActive: { backgroundColor: '#7C6DFA' },
  optionLetterText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '900' },
  optionLetterTextActive: { color: '#fff' },
  optionText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, flex: 1, lineHeight: 18 },

  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: radius.pill, marginTop: 18,
  },
  submitBtnText: { color: '#fff', fontSize: 14, fontWeight: '900' },

  /* result */
  resultRoot: { alignItems: 'center', gap: 10 },
  resultEmojiWrap: { paddingVertical: 8 },
  resultEmoji: { fontSize: 56 },
  resultTitle: { color: '#fff', fontSize: 22, fontWeight: '900', textAlign: 'center' },
  resultScore: { color: '#5EEAD4', fontSize: 48, fontWeight: '900' },
  resultDetail: { color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: '700' },
  resultNote: { color: '#FBBF24', fontSize: 12, marginTop: 6 },
  jobBadge: {
    padding: 14, borderRadius: radius.lg, marginTop: 10,
    borderWidth: 1, borderColor: 'rgba(94,234,212,0.32)',
  },
  jobBadgeText: { color: '#5EEAD4', fontSize: 12, fontWeight: '800', textAlign: 'center', lineHeight: 17 },

  certCard: {
    marginTop: 18, padding: 22, borderRadius: radius.lg, alignItems: 'center', gap: 6,
    borderWidth: 2, borderColor: '#FBBF24',
    backgroundColor: 'rgba(20,15,5,0.7)',
  },
  certHeading: { color: '#FBBF24', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  certCourse: { color: '#fff', fontSize: 16, fontWeight: '900', textAlign: 'center', marginVertical: 6 },
  certLine: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  certSeal: {
    marginTop: 12, paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 2, borderColor: '#FBBF24', borderRadius: radius.pill,
  },
  certSealText: { color: '#FBBF24', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },

  resultActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  resultBtn: { paddingHorizontal: 22, paddingVertical: 12, borderRadius: radius.pill },
  resultBtnPrimary: { backgroundColor: '#7C6DFA' },
  resultBtnTextPrimary: { color: '#fff', fontWeight: '900', fontSize: 13 },
  resultBtnGhost: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  resultBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  error: { color: '#fff', padding: 32, textAlign: 'center' },
});
