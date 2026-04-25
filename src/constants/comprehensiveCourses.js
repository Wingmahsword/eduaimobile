/**
 * Registry of "comprehensive" multi-week courses with full curriculum,
 * quizzes, certification, and achievements.
 *
 * Detail / Lesson / Quiz screens take a `courseId` param and look up
 * the bundle here so they can render any registered course.
 */

import {
  PROMPT_COURSE_ID,
  PROMPT_COURSE_META,
  PROMPT_COURSE_MONTHS,
  PROMPT_COURSE_QUIZZES,
  PROMPT_COURSE_ACHIEVEMENTS,
  LESSON_TYPES,
} from './promptCourse';

import {
  ML_COURSE_ID,
  ML_COURSE_META,
  ML_COURSE_MONTHS,
  ML_COURSE_QUIZZES,
  ML_COURSE_ACHIEVEMENTS,
} from './mlCourse';

export { LESSON_TYPES };

export const COMPREHENSIVE_COURSES = {
  [PROMPT_COURSE_ID]: {
    id: PROMPT_COURSE_ID,
    meta: PROMPT_COURSE_META,
    months: PROMPT_COURSE_MONTHS,
    quizzes: PROMPT_COURSE_QUIZZES,
    achievements: PROMPT_COURSE_ACHIEVEMENTS,
    accent: '#7C6DFA',          // primary brand colour for hero / CTA
    secondary: '#5EEAD4',
  },
  [ML_COURSE_ID]: {
    id: ML_COURSE_ID,
    meta: ML_COURSE_META,
    months: ML_COURSE_MONTHS,
    quizzes: ML_COURSE_QUIZZES,
    achievements: ML_COURSE_ACHIEVEMENTS,
    accent: '#10B981',
    secondary: '#38BDF8',
  },
};

/**
 * Ordered list — drives the Courses screen featured-hero rendering order.
 */
export const COMPREHENSIVE_COURSE_IDS = [PROMPT_COURSE_ID, ML_COURSE_ID];

export function getCourseBundle(courseId) {
  return COMPREHENSIVE_COURSES[courseId] || null;
}

export function findLessonInCourse(courseId, lessonId) {
  const bundle = getCourseBundle(courseId);
  if (!bundle) return null;
  for (const month of bundle.months) {
    for (const week of month.weeks) {
      const lesson = week.lessons.find((l) => l.id === lessonId);
      if (lesson) return { lesson, week, month, bundle };
    }
  }
  return null;
}

export function findNextLessonInCourse(courseId, lessonId) {
  const bundle = getCourseBundle(courseId);
  if (!bundle) return null;
  let foundCurrent = false;
  for (const month of bundle.months) {
    for (const week of month.weeks) {
      for (const l of week.lessons) {
        if (foundCurrent) return l.id;
        if (l.id === lessonId) foundCurrent = true;
      }
    }
  }
  return null;
}

/**
 * Locate the courseId that owns a given lessonId — used as a fallback
 * when a screen receives just a lessonId without the courseId.
 */
export function findCourseForLesson(lessonId) {
  for (const id of COMPREHENSIVE_COURSE_IDS) {
    const hit = findLessonInCourse(id, lessonId);
    if (hit) return id;
  }
  return null;
}

/**
 * Locate the courseId that owns a given quizId.
 */
export function findCourseForQuiz(quizId) {
  for (const id of COMPREHENSIVE_COURSE_IDS) {
    const bundle = COMPREHENSIVE_COURSES[id];
    if (bundle.quizzes && bundle.quizzes[quizId]) return id;
  }
  return null;
}
