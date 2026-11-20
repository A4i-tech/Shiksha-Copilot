// Keyed by template outputFormat.
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

const SKELETONS: { [format: string]: () => any } = {
  plain_text: () => '',
  json_5E_checklist: () =>
    Object.fromEntries(['engage', 'explore', 'explain', 'elaborate', 'evaluate'].map((phase) => [phase, { activity: '', materials: '' }])),
  json_1: () =>
    DIFFICULTIES.map((difficulty) => ({
      difficulty,
      content: [
        { type: 'MCQs', questions: [{ question: '', options: ['', '', '', ''] }] },
        { type: 'assessment', questions: [{ question: '' }] },
      ],
    })),
  json_2: () => DIFFICULTIES.map((difficulty) => ({ difficulty, content: [{ title: '', question: '', description: '' }] })),
  json_3: () => [{ id: 'activity_1', title: '', preparation: '', required_materials: '', obtaining_materials: '', recap: '' }],
};

export interface SectionTemplate {
  id: string;
  title: string;
  outputFormat: string;
}

export function blankSections(templateSections: SectionTemplate[]): any[] {
  return templateSections
    .filter((section) => SKELETONS[section.outputFormat])
    .map(({ id, title, outputFormat }) => ({ id, title, outputFormat, content: SKELETONS[outputFormat]() }));
}

// Keys that name a fixed group of the content. A list whose items carry one never grows.
export const GROUP_KEYS = ['difficulty', 'type'];
// Slot keys are never curator text.
export const SLOT_KEYS = ['id', ...GROUP_KEYS];

export const isObject = (value: any) => value !== null && typeof value === 'object' && !Array.isArray(value);

export function hasText(value: any): boolean {
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.some(hasText);
  if (isObject(value)) return Object.entries(value).some(([key, item]) => !SLOT_KEYS.includes(key) && hasText(item));
  return false;
}

// Drops blank objects from a list. Strings stay, so the A-D option slots keep their place.
function prune(value: any): any {
  if (Array.isArray(value)) return value.filter((item) => !isObject(item) || hasText(item)).map(prune);
  if (isObject(value)) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, prune(item)]));
  return value;
}

export function filledSections(sections: any[]): any[] {
  return sections.filter((section) => hasText(section.content)).map((section) => ({ ...section, content: prune(section.content) }));
}
