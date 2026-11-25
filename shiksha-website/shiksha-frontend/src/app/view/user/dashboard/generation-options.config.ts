/**
 * Home page generation tiles (issue #677).
 *
 * `image` values are temporary placeholders reusing existing project icons.
 * Swap them here when design delivers the final assets — no template change needed.
 */
export interface GenerationOption {
  id: string;
  /** i18n key, also the English label */
  label: string;
  route: string;
  /** User must hold every permission (parent route guard + child route guard) */
  permissions: string[];
  image: string;
  /** Primary tiles share the first row; the rest are full-width rows */
  primary: boolean;
  testId: string;
}

export interface VisibleGenerationOption extends GenerationOption {
  fullWidth: boolean;
}

export const GENERATION_OPTIONS: GenerationOption[] = [
  {
    id: 'period-plan',
    label: 'Generate New Period Plan',
    route: '/content-generation/lesson-plan',
    permissions: ['content.view', 'lesson-plan.generate'],
    image: 'assets/icons/lesson-plan-black.svg',
    primary: true,
    testId: 'generate-period-plan-tile',
  },
  {
    id: 'question-paper',
    label: 'Generate New Question Paper',
    route: '/question-papers/generate',
    permissions: ['question-paper.generate'],
    image: 'assets/icons/question-bank.svg',
    primary: true,
    testId: 'generate-question-paper-tile',
  },
  {
    id: 'lesson-resource',
    label: 'Generate New Lesson Resource',
    route: '/content-generation/lesson-resources',
    permissions: ['content.view', 'lesson-resource.generate'],
    image: 'assets/icons/docs_p.svg',
    primary: false,
    testId: 'generate-lesson-resource-tile',
  },
  {
    id: 'presentation',
    label: 'Generate New Presentation',
    route: '/content-generation/presentation',
    permissions: ['content.view', 'presentation.generate.arbitrary'],
    image: 'assets/icons/ppt-file.svg',
    primary: false,
    testId: 'generate-presentation-tile',
  },
];
