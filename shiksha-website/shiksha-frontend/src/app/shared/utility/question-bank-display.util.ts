import { QUESTION_SOURCE } from './constant.util';

export interface QuestionContentItem {
  contentType: string;
  content: string;
}

export function difficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'bg-green-100 text-green-700 border-green-200';
    case 'average': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'difficult': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

export function sourceTagClass(source: string): string {
  return source === QUESTION_SOURCE.AI ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
}

export function sourceBorderClass(source: string): string {
  return source === QUESTION_SOURCE.AI ? 'border-l-blue-500' : 'border-l-green-500';
}

export function contentItems(content: unknown): QuestionContentItem[] {
  if (content == null) return [];
  if (Array.isArray(content)) return content as QuestionContentItem[];
  return [{ contentType: 'text/plain', content: String(content) }];
}

export function questionContentItems(question: any): QuestionContentItem[] {
  if (question?.type === 'MATCHING') {
    return [...contentItems(question.value1), { contentType: 'text/plain', content: '-' }, ...contentItems(question.value2)];
  }
  return contentItems(question?.text ?? question?.question);
}

export function questionText(question: any): string {
  return questionContentItems(question).filter(item => item.contentType === 'text/plain').map(item => item.content) .join(' ');
}

export function hasQuestionImage(question: any): boolean {
  const content = [
    ...questionContentItems(question),
    ...contentItems(question?.keyAnswer),
    ...(question?.options || []).flatMap((option: any) => contentItems(option?.text)),
  ];
  return content.some(item => item.contentType?.startsWith('image/'));
}
