export interface QuestionContentItem {
  contentType: string;
  content: string;
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
