import { diffWords, diffLines } from 'diff';

export function buildDiffParts(
  oldContent: any,
  newContent: any,
  outputFormat: string
): { value: string; added?: boolean; removed?: boolean }[] {
  const isPlain = outputFormat === 'plain_text';
  const oldStr = isPlain ? oldContent || '' : JSON.stringify(oldContent, null, 2);
  const newStr = isPlain ? newContent || '' : JSON.stringify(newContent, null, 2);
  return isPlain ? diffWords(oldStr, newStr) : diffLines(oldStr, newStr);
}
