import { GENERATION_TILE_IMAGES } from 'src/app/shared/components/generation-tile/generation-tile.component';

/**
 * Home page generation tiles (issue #677).
 *
 * Images come from the shared GENERATION_TILE_IMAGES map (design-approved #677 illustrations).
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
    image: GENERATION_TILE_IMAGES.periodPlan,
    primary: true,
    testId: 'generate-period-plan-tile',
  },
  {
    id: 'question-paper',
    label: 'Generate New Question Paper',
    route: '/question-papers/generate',
    permissions: ['question-paper.generate'],
    image: GENERATION_TILE_IMAGES.questionPaper,
    primary: true,
    testId: 'generate-question-paper-tile',
  },
  {
    id: 'lesson-resource',
    label: 'Generate New Lesson Resource',
    route: '/content-generation/lesson-resources',
    permissions: ['content.view', 'lesson-resource.generate'],
    image: GENERATION_TILE_IMAGES.lessonResource,
    primary: false,
    testId: 'generate-lesson-resource-tile',
  },
  {
    id: 'presentation',
    label: 'Generate New Presentation',
    route: '/content-generation/presentation',
    permissions: ['content.view', 'presentation.generate.arbitrary'],
    image: GENERATION_TILE_IMAGES.presentation,
    primary: false,
    testId: 'generate-presentation-tile',
  },
];
