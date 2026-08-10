/**
 * Configuration of the admin content-management pages.
 *
 * Each entity maps to one segment of the backend route family
 * `/api/admin/content/<segment>`. The list columns and the edit fields come
 * from this file, so the four entity pages share one list component and one
 * edit component.
 *
 * The field types match what the backend update validators accept:
 *  - text / textarea / number / boolean map to a single scalar value.
 *  - list maps to an array of strings, one value per line in the form.
 *  - json maps to an array or an object that the form shows as raw JSON.
 */

export type ContentEntityKey =
  | 'chapters'
  | 'lesson-plans'
  | 'resources'
  | 'questions';

export type ContentFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'list'
  | 'json';

export interface ContentColumn {
  /** property of the record, a dot path is allowed */
  field: string;
  label: string;
}

export interface ContentField {
  field: string;
  label: string;
  type: ContentFieldType;
  /** short help text under the control */
  hint?: string;
  /** the add form shows this field, the edit form hides it */
  createOnly?: boolean;
  /** the add form needs a value in this field */
  requiredOnCreate?: boolean;
}

export interface ContentEntityConfig {
  key: ContentEntityKey;
  /** segment of the backend route */
  segment: string;
  label: string;
  /** singular name, used in messages */
  singular: string;
  columns: ContentColumn[];
  fields: ContentField[];
  /** the list page shows an add button and the form can create a record */
  canCreate?: boolean;
  /** the list page shows the JSON upload of many records */
  canBulkUpload?: boolean;
}

export const CONTENT_ENTITIES: ContentEntityConfig[] = [
  {
    key: 'chapters',
    segment: 'chapters',
    label: 'Chapters',
    singular: 'Chapter',
    canCreate: true,
    canBulkUpload: true,
    columns: [
      { field: 'topics', label: 'Chapter' },
      { field: 'subject.0.subjectName', label: 'Subject' },
      { field: 'standard', label: 'Class' },
      { field: 'medium', label: 'Medium' },
      { field: 'board', label: 'Board' },
      { field: 'orderNumber', label: 'Order' },
    ],
    fields: [
      {
        field: 'subjectId',
        label: 'Subject id',
        type: 'text',
        createOnly: true,
        requiredOnCreate: true,
        hint: 'Id of the master subject. The subject holds the board and the class list, so the values below must match it.',
      },
      { field: 'topics', label: 'Chapter name', type: 'text', requiredOnCreate: true },
      { field: 'standard', label: 'Class', type: 'number', requiredOnCreate: true },
      { field: 'medium', label: 'Medium', type: 'text', requiredOnCreate: true },
      { field: 'board', label: 'Board', type: 'text', requiredOnCreate: true },
      {
        field: 'orderNumber',
        label: 'Chapter order number',
        type: 'number',
        requiredOnCreate: true,
      },
      {
        field: 'indexPath',
        label: 'Index path (optional)',
        type: 'text',
        hint: 'Leave this empty. The upload sets the standard path, and the ingestion pipeline writes the final path after it indexes the textbook.',
      },
      {
        field: 'subTopics',
        label: 'Subtopics',
        type: 'list',
        hint: 'One subtopic per line.',
      },
      { field: 'learningOutcomes', label: 'Learning outcomes', type: 'list' },
      { field: 'isGrammar', label: 'Grammar chapter', type: 'boolean' },
      { field: 'grammarTopics', label: 'Grammar topics', type: 'list' },
      {
        field: 'grammarSourceChapters',
        label: 'Grammar source chapters',
        type: 'list',
      },
    ],
  },
  {
    key: 'lesson-plans',
    segment: 'lesson-plans',
    label: 'Lesson plans',
    singular: 'Lesson plan',
    canBulkUpload: true,
    columns: [
      { field: 'name', label: 'Name' },
      { field: 'class', label: 'Class' },
      { field: 'medium', label: 'Medium' },
      { field: 'board', label: 'Board' },
      { field: 'subject', label: 'Subject' },
    ],
    fields: [
      { field: 'name', label: 'Name', type: 'text' },
      { field: 'class', label: 'Class', type: 'number' },
      { field: 'board', label: 'Board', type: 'text' },
      { field: 'medium', label: 'Medium', type: 'text' },
      { field: 'semester', label: 'Semester', type: 'text' },
      { field: 'subject', label: 'Subject', type: 'text' },
      { field: 'teachingModel', label: 'Teaching model', type: 'list' },
      { field: 'subTopics', label: 'Subtopics', type: 'list' },
      { field: 'learningOutcomes', label: 'Learning outcomes', type: 'json' },
      { field: 'instructionSet', label: 'Instruction set', type: 'json' },
      { field: 'sections', label: 'Sections', type: 'json' },
      { field: 'checkList', label: 'Checklist', type: 'json' },
      { field: 'videos', label: 'Videos', type: 'json' },
      { field: 'documents', label: 'Documents', type: 'json' },
      { field: 'interactOutput', label: 'Interact output', type: 'json' },
      {
        field: 'extractedResources',
        label: 'Extracted resources',
        type: 'json',
      },
      { field: 'isAll', label: 'Covers all subtopics', type: 'boolean' },
    ],
  },
  {
    key: 'resources',
    segment: 'resources',
    label: 'Lesson resources',
    singular: 'Resource plan',
    columns: [
      { field: 'lessonName', label: 'Name' },
      { field: 'class', label: 'Class' },
      { field: 'medium', label: 'Medium' },
      { field: 'board', label: 'Board' },
      { field: 'subject', label: 'Subject' },
    ],
    fields: [
      { field: 'lessonName', label: 'Name', type: 'text' },
      { field: 'class', label: 'Class', type: 'number' },
      { field: 'board', label: 'Board', type: 'text' },
      { field: 'medium', label: 'Medium', type: 'text' },
      { field: 'levels', label: 'Level', type: 'text' },
      { field: 'semester', label: 'Semester', type: 'text' },
      { field: 'subject', label: 'Subject', type: 'text' },
      { field: 'subTopics', label: 'Subtopics', type: 'list' },
      { field: 'learningOutcomes', label: 'Learning outcomes', type: 'json' },
      { field: 'resources', label: 'Resources', type: 'json' },
      {
        field: 'additionalResources',
        label: 'Additional resources',
        type: 'json',
      },
      { field: 'isAll', label: 'Covers all subtopics', type: 'boolean' },
    ],
  },
  {
    key: 'questions',
    segment: 'questions',
    label: 'Questions',
    singular: 'Question',
    columns: [
      { field: 'text', label: 'Question' },
      { field: 'subject', label: 'Subject' },
      { field: 'class', label: 'Class' },
      { field: 'medium', label: 'Medium' },
      { field: 'answerType', label: 'Answer type' },
      { field: 'difficulty', label: 'Difficulty' },
    ],
    fields: [
      { field: 'text', label: 'Question text', type: 'textarea' },
      { field: 'subject', label: 'Subject', type: 'text' },
      { field: 'medium', label: 'Medium', type: 'text' },
      { field: 'class', label: 'Class', type: 'text' },
      { field: 'groupHeading', label: 'Group heading', type: 'text' },
      { field: 'answerType', label: 'Answer type', type: 'text' },
      { field: 'difficulty', label: 'Difficulty', type: 'text' },
      { field: 'marksPerQuestion', label: 'Marks per question', type: 'number' },
      { field: 'keyAnswer', label: 'Key answer', type: 'textarea' },
      {
        field: 'chapter',
        label: 'Chapter reference',
        type: 'json',
        hint: 'Shape: { "chapterNumber": <number>, "title": "<chapter>" }',
      },
      { field: 'options', label: 'Options', type: 'json' },
      { field: 'pairs', label: 'Pairs', type: 'json' },
      { field: 'items', label: 'Items', type: 'json' },
      { field: 'correctOrderById', label: 'Correct order by id', type: 'json' },
      {
        field: 'correctOrderIndices',
        label: 'Correct order indices',
        type: 'json',
      },
    ],
  },
];

export function getContentEntityConfig(
  key: string | null
): ContentEntityConfig | undefined {
  return CONTENT_ENTITIES.find((entity) => entity.key === key);
}
