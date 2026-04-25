/**
 * Prompt Engineering & Token Mastery — flagship 12-week course meta.
 * 3 Months × 4 Weeks × 4 Lessons = 48 lessons + 2 quizzes + 1 cert exam.
 */

export const PROMPT_COURSE_ID = 'prompt_eng_mastery';

export const PROMPT_COURSE_META = {
  id: PROMPT_COURSE_ID,
  title: 'Prompt Engineering & Token Mastery',
  subtitle: 'From Zero to Certified Prompt Engineer in 12 Weeks',
  instructor: 'EduAI Academy',
  category: 'Prompt Engineering',
  level: 'Beginner → Pro',
  duration: '12 weeks · 48 lessons',
  price: 149,
  originalPrice: 7999,
  badge: 'PE-CERT-2026',
  jobGuarantee: '89%+ Score = Job Guaranteed',
  description:
    'A guided, hands-on path from your first prompt to a Certified Prompt Engineer. 48 bite-sized lessons, 2 fun quizzes, real labs, and a certification exam — fast, fun, and job-relevant.',
  highlights: [
    '48 hands-on lessons across 12 weeks',
    '2 fun quizzes + final certification exam',
    'Real labs with templates and starter prompts',
    'Job Guarantee tier at 89%+ on the certification',
  ],
  featured: true,
  comprehensive: true,
  totalLessons: 48,
};

export const LESSON_TYPES = {
  video:    { icon: 'play-circle',    label: 'Video Lesson',       accent: '#7C6DFA' },
  lab:      { icon: 'flask',          label: 'Hands-on Lab',       accent: '#5EEAD4' },
  resource: { icon: 'cube',           label: 'Resource Pack',      accent: '#F59E0B' },
  project:  { icon: 'construct',      label: 'Capstone Project',   accent: '#F472B6' },
  review:   { icon: 'refresh-circle', label: 'Review Session',     accent: '#38BDF8' },
  exam:     { icon: 'trophy',         label: 'Certification Exam', accent: '#FBBF24' },
};
