export type SectionFormat = 'plain_text' | 'json_5E_checklist' | 'json_1' | 'json_2' | 'json_3';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Phase = 'engage' | 'explore' | 'explain' | 'elaborate' | 'evaluate';

export interface Mcq {
  question: string;
  options: string[];
}
export interface McqGroup {
  type: 'MCQs';
  questions: Mcq[];
}
export interface AssessmentQuestion {
  question: string;
}
export interface AssessmentGroup {
  type: 'assessment';
  questions: AssessmentQuestion[];
}
export interface Scenario {
  title: string;
  question: string;
  description: string;
}
export interface Activity {
  id: string;
  title: string;
  preparation: string;
  required_materials: string;
  obtaining_materials: string;
  recap: string;
}
export interface PhaseContent {
  activity: string;
  materials: string;
}
export interface QuestionBankLevel {
  difficulty: Difficulty;
  content: (McqGroup | AssessmentGroup)[];
}
export interface ScenarioLevel {
  difficulty: Difficulty;
  content: Scenario[];
}

interface SectionBase {
  id: string;
  title: string;
}
export interface PlainTextSection extends SectionBase {
  outputFormat: 'plain_text';
  content: string;
}
export interface ChecklistSection extends SectionBase {
  outputFormat: 'json_5E_checklist';
  content: Record<Phase, PhaseContent>;
}
export interface QuestionBankSection extends SectionBase {
  outputFormat: 'json_1';
  content: QuestionBankLevel[];
}
export interface ScenarioSection extends SectionBase {
  outputFormat: 'json_2';
  content: ScenarioLevel[];
}
export interface ActivitySection extends SectionBase {
  outputFormat: 'json_3';
  content: Activity[];
}
export type Section = PlainTextSection | ChecklistSection | QuestionBankSection | ScenarioSection | ActivitySection;

export interface LessonPlanTemplate {
  _id: string;
  name: string;
  workFlowId: string;
  sections: SectionTemplate[];
}

export interface SectionTemplate {
  id: string;
  title: string;
  outputFormat: string;
}

export const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
export const PHASES: Phase[] = ['engage', 'explore', 'explain', 'elaborate', 'evaluate'];

const hasText = (value: string): boolean => value.trim() !== '';
const anyText = (...values: string[]): boolean => values.some(hasText);

export const blankMcq = (): Mcq => ({ question: '', options: ['', '', '', ''] });
export const blankAssessmentQuestion = (): AssessmentQuestion => ({ question: '' });
export const blankScenario = (): Scenario => ({ title: '', question: '', description: '' });
export function blankActivity(existing: Activity[]): Activity {
  const highest = Math.max(0, ...existing.map((activity) => Number(activity.id.replace('activity_', ''))));
  return { id: `activity_${highest + 1}`, title: '', preparation: '', required_materials: '', obtaining_materials: '', recap: '' };
}

export function blankSection(template: SectionTemplate): Section {
  const { id, title } = template;
  switch (template.outputFormat) {
    case 'plain_text':
      return { id, title, outputFormat: 'plain_text', content: '' };
    case 'json_5E_checklist':
      return {
        id,
        title,
        outputFormat: 'json_5E_checklist',
        content: {
          engage: { activity: '', materials: '' },
          explore: { activity: '', materials: '' },
          explain: { activity: '', materials: '' },
          elaborate: { activity: '', materials: '' },
          evaluate: { activity: '', materials: '' },
        },
      };
    case 'json_1':
      return {
        id,
        title,
        outputFormat: 'json_1',
        content: DIFFICULTIES.map((difficulty) => ({
          difficulty,
          content: [
            { type: 'MCQs', questions: [blankMcq()] },
            { type: 'assessment', questions: [blankAssessmentQuestion()] },
          ],
        })),
      };
    case 'json_2':
      return {
        id,
        title,
        outputFormat: 'json_2',
        content: DIFFICULTIES.map((difficulty) => ({ difficulty, content: [blankScenario()] })),
      };
    case 'json_3':
      return { id, title, outputFormat: 'json_3', content: [blankActivity([])] };
    default:
      throw new Error(`Unsupported section format "${template.outputFormat}".`);
  }
}

export const blankSections = (templates: SectionTemplate[]): Section[] => templates.map(blankSection);

const filledMcqs = (questions: Mcq[]) => questions.filter((item) => anyText(item.question, ...item.options));
const filledAssessments = (questions: AssessmentQuestion[]) => questions.filter((item) => anyText(item.question));

function filledQuestionBank(levels: QuestionBankLevel[]): QuestionBankLevel[] {
  return levels
    .map((level) => ({
      ...level,
      content: level.content
        .map((group) =>
          group.type === 'MCQs' ? { ...group, questions: filledMcqs(group.questions) } : { ...group, questions: filledAssessments(group.questions) }
        )
        .filter((group) => group.questions.length > 0),
    }))
    .filter((level) => level.content.length > 0);
}

function filledScenarios(levels: ScenarioLevel[]): ScenarioLevel[] {
  return levels
    .map((level) => ({ ...level, content: level.content.filter((item) => anyText(item.title, item.question, item.description)) }))
    .filter((level) => level.content.length > 0);
}

const filledActivities = (activities: Activity[]) =>
  activities.filter((item) => anyText(item.title, item.preparation, item.required_materials, item.obtaining_materials, item.recap));

function filledSection(section: Section): Section | undefined {
  switch (section.outputFormat) {
    case 'plain_text':
      return hasText(section.content) ? section : undefined;
    case 'json_5E_checklist':
      return PHASES.some((phase) => anyText(section.content[phase].activity, section.content[phase].materials)) ? section : undefined;
    case 'json_1': {
      const content = filledQuestionBank(section.content);
      return content.length ? { ...section, content } : undefined;
    }
    case 'json_2': {
      const content = filledScenarios(section.content);
      return content.length ? { ...section, content } : undefined;
    }
    case 'json_3': {
      const content = filledActivities(section.content);
      return content.length ? { ...section, content } : undefined;
    }
  }
}

export const filledSections = (sections: Section[]): Section[] =>
  sections.map(filledSection).filter((section): section is Section => section !== undefined);
