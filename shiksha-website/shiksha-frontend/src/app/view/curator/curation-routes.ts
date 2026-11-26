export const CURATION_PATH = {
  lessonPlan: 'curation/lesson-plan',
  lessonResources: 'curation/lesson-resources',
} as const;

export const CURATION_URL = {
  lessonPlan: `/${CURATION_PATH.lessonPlan}`,
  lessonResources: `/${CURATION_PATH.lessonResources}`,
} as const;
