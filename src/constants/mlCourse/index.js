/**
 * Introduction to Machine Learning — barrel export.
 */
import { ML_COURSE_ID, ML_COURSE_META } from './meta';
import { MONTH_1 } from './month1';
import { MONTH_2 } from './month2';
import { MONTH_3 } from './month3';
import { QUIZ_1, QUIZ_2 } from './quizzes';
import { CERTIFICATION } from './certification';

export { ML_COURSE_ID, ML_COURSE_META };

export const ML_COURSE_MONTHS = [MONTH_1, MONTH_2, MONTH_3];

export const ML_COURSE_QUIZZES = {
  ml_quiz1: QUIZ_1,
  ml_quiz2: QUIZ_2,
  ml_certification: CERTIFICATION,
};

export const ML_COURSE_ACHIEVEMENTS = [
  { id: 'ml_first',   icon: 'play',          title: 'First Step',     desc: 'Complete your first ML lesson',
    check: (s) => s.completedLessons.length >= 1 },
  { id: 'ml_week1',   icon: 'calendar',      title: 'Week Champion',  desc: 'Finish all Week 1 lessons',
    check: (s) => ['ml.1.1.1','ml.1.1.2','ml.1.1.3','ml.1.1.4'].every((l) => s.completedLessons.includes(l)) },
  { id: 'ml_five',    icon: 'flame',         title: 'On Fire',        desc: 'Complete 5 lessons',
    check: (s) => s.completedLessons.length >= 5 },
  { id: 'ml_ten',     icon: 'flash',         title: 'Unstoppable',    desc: 'Complete 10 lessons',
    check: (s) => s.completedLessons.length >= 10 },
  { id: 'ml_quiz1',   icon: 'ribbon',        title: 'Quiz Slayer',    desc: 'Pass ML Quiz #1',
    check: (s) => (s.quizScores?.ml_quiz1 ?? 0) >= 60 },
  { id: 'ml_quiz1p',  icon: 'diamond',       title: 'Perfect Score',  desc: 'Score 100% on Quiz #1',
    check: (s) => s.quizScores?.ml_quiz1 === 100 },
  { id: 'ml_month1',  icon: 'star',          title: 'Module 1 Master',desc: 'Finish all Module 1 lessons',
    check: (s) => s.completedLessons.filter((l) => l.startsWith('ml.1.')).length >= 16 },
  { id: 'ml_twenty',  icon: 'rocket',        title: 'Halfway Hero',   desc: 'Complete 20 lessons',
    check: (s) => s.completedLessons.length >= 20 },
  { id: 'ml_quiz2',   icon: 'ribbon',        title: 'Algorithm Ace',  desc: 'Pass ML Quiz #2',
    check: (s) => (s.quizScores?.ml_quiz2 ?? 0) >= 60 },
  { id: 'ml_month2',  icon: 'star',          title: 'Module 2 Master',desc: 'Finish all Module 2 lessons',
    check: (s) => s.completedLessons.filter((l) => l.startsWith('ml.2.')).length >= 16 },
  { id: 'ml_thirty',  icon: 'barbell',       title: 'Almost There',   desc: 'Complete 30 lessons',
    check: (s) => s.completedLessons.length >= 30 },
  { id: 'ml_all',     icon: 'medal',         title: 'Course Complete',desc: 'Complete all 48 lessons',
    check: (s) => s.completedLessons.length >= 48 },
  { id: 'ml_cert',    icon: 'trophy',        title: 'ML Certified',   desc: 'Pass the ML certification exam',
    check: (s) => (s.quizScores?.ml_certification ?? 0) >= 70 },
  { id: 'ml_job',     icon: 'briefcase',     title: 'Job Guaranteed', desc: 'Score 89%+ on ML certification',
    check: (s) => (s.quizScores?.ml_certification ?? 0) >= 89 },
  { id: 'ml_legend',  icon: 'sparkles',      title: 'ML Legend',      desc: 'Score 100% on certification',
    check: (s) => s.quizScores?.ml_certification === 100 },
];
