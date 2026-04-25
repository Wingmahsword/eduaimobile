/**
 * Prompt Engineering & Token Mastery — barrel export.
 */
import { PROMPT_COURSE_ID, PROMPT_COURSE_META, LESSON_TYPES } from './meta';
import { MONTH_1 } from './month1';
import { MONTH_2 } from './month2';
import { MONTH_3 } from './month3';
import { QUIZ_1, QUIZ_2 } from './quizzes';
import { CERTIFICATION } from './certification';

export { PROMPT_COURSE_ID, PROMPT_COURSE_META, LESSON_TYPES };

export const PROMPT_COURSE_MONTHS = [MONTH_1, MONTH_2, MONTH_3];

export const PROMPT_COURSE_QUIZZES = {
  quiz1: QUIZ_1,
  quiz2: QUIZ_2,
  certification: CERTIFICATION,
};

/* ─── ACHIEVEMENTS ─────────────────────────────────────────────── */
export const PROMPT_COURSE_ACHIEVEMENTS = [
  { id: 'first_lesson',   icon: 'play',           title: 'First Step',     desc: 'Complete your first lesson',
    check: (s) => s.completedLessons.length >= 1 },
  { id: 'week_1',         icon: 'calendar',       title: 'Week Warrior',   desc: 'Finish all Week 1 lessons',
    check: (s) => ['1.1.1','1.1.2','1.1.3','1.1.4'].every((l) => s.completedLessons.includes(l)) },
  { id: 'five_lessons',   icon: 'flame',          title: 'On Fire',        desc: 'Complete 5 lessons',
    check: (s) => s.completedLessons.length >= 5 },
  { id: 'ten_lessons',    icon: 'flash',          title: 'Unstoppable',    desc: 'Complete 10 lessons',
    check: (s) => s.completedLessons.length >= 10 },
  { id: 'quiz1_pass',     icon: 'ribbon',         title: 'Quiz Slayer',    desc: 'Pass Fun Quiz #1',
    check: (s) => (s.quizScores?.quiz1 ?? 0) >= 60 },
  { id: 'quiz1_perfect',  icon: 'diamond',        title: 'Perfect Score',  desc: 'Score 100% on Quiz #1',
    check: (s) => s.quizScores?.quiz1 === 100 },
  { id: 'month1',         icon: 'star',           title: 'Month 1 Master', desc: 'Finish all Month 1 lessons',
    check: (s) => s.completedLessons.filter((l) => l.startsWith('1.')).length >= 16 },
  { id: 'twenty_lessons', icon: 'rocket',         title: 'Halfway Hero',   desc: 'Complete 20 lessons',
    check: (s) => s.completedLessons.length >= 20 },
  { id: 'quiz2_pass',     icon: 'ribbon',         title: 'Token Tactician',desc: 'Pass Fun Quiz #2',
    check: (s) => (s.quizScores?.quiz2 ?? 0) >= 60 },
  { id: 'month2',         icon: 'star',           title: 'Month 2 Master', desc: 'Finish all Month 2 lessons',
    check: (s) => s.completedLessons.filter((l) => l.startsWith('2.')).length >= 16 },
  { id: 'thirty_lessons', icon: 'barbell',        title: 'Almost There',   desc: 'Complete 30 lessons',
    check: (s) => s.completedLessons.length >= 30 },
  { id: 'all_lessons',    icon: 'medal',          title: 'Course Complete',desc: 'Complete all 48 lessons',
    check: (s) => s.completedLessons.length >= 48 },
  { id: 'cert_pass',      icon: 'trophy',         title: 'Certified',      desc: 'Pass the certification exam',
    check: (s) => (s.quizScores?.certification ?? 0) >= 70 },
  { id: 'cert_job',       icon: 'briefcase',      title: 'Job Guaranteed', desc: 'Score 89%+ on certification',
    check: (s) => (s.quizScores?.certification ?? 0) >= 89 },
  { id: 'cert_perfect',   icon: 'sparkles',       title: 'Legendary',      desc: 'Score 100% on certification',
    check: (s) => s.quizScores?.certification === 100 },
];
