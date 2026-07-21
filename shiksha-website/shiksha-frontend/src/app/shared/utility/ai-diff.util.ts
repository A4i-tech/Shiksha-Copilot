import { diffLines, diffWords } from 'diff';

export interface DiffWordSegment {
  text: string;
  changed: boolean;
}

export interface UnifiedDiffLine {
  type: 'add' | 'remove' | 'context';
  oldLine: number | null;
  newLine: number | null;
  text: string;
  /** Present only when this line is part of a 1:1 removed/added replacement — the sub-line changed words. */
  segments?: DiffWordSegment[];
}

/** For paired replace lines (a removed line directly followed by its added replacement),
 * annotate both with word-level segments so only the actually-changed words get highlighted. */
function annotateWordDiffs(lines: UnifiedDiffLine[]): void {
  let i = 0;
  while (i < lines.length) {
    if (lines[i].type !== 'remove') {
      i++;
      continue;
    }

    const removeStart = i;
    while (i < lines.length && lines[i].type === 'remove') i++;
    const removeCount = i - removeStart;

    const addStart = i;
    while (i < lines.length && lines[i].type === 'add') i++;
    const addCount = i - addStart;

    const pairCount = Math.min(removeCount, addCount);
    for (let j = 0; j < pairCount; j++) {
      const removeLine = lines[removeStart + j];
      const addLine = lines[addStart + j];
      const wordParts = diffWords(removeLine.text, addLine.text);
      removeLine.segments = wordParts
        .filter((p) => !p.added)
        .map((p) => ({ text: p.value, changed: !!p.removed }));
      addLine.segments = wordParts
        .filter((p) => !p.removed)
        .map((p) => ({ text: p.value, changed: !!p.added }));
    }
  }
}

export type SectionContent = string | Record<string, unknown> | unknown[];

export function buildDiffParts(
  oldContent: SectionContent,
  newContent: SectionContent,
  outputFormat: string
): UnifiedDiffLine[] {
  const isPlain = outputFormat === 'plain_text';
  const toStr = (content: SectionContent) =>
    isPlain ? (content as string) || '' : JSON.stringify(content, null, 2);
  const oldStr = toStr(oldContent);
  const newStr = toStr(newContent);
  const parts = diffLines(oldStr, newStr);

  const lines: UnifiedDiffLine[] = [];
  let oldLine = 1;
  let newLine = 1;
  for (const part of parts) {
    const partLines = part.value.split('\n');
    if (partLines[partLines.length - 1] === '') {
      partLines.pop();
    }
    for (const text of partLines) {
      if (part.added) {
        lines.push({ type: 'add', oldLine: null, newLine: newLine++, text });
      } else if (part.removed) {
        lines.push({ type: 'remove', oldLine: oldLine++, newLine: null, text });
      } else {
        lines.push({ type: 'context', oldLine: oldLine++, newLine: newLine++, text });
      }
    }
  }
  annotateWordDiffs(lines);
  return lines;
}

export interface SplitDiffRow {
  left: UnifiedDiffLine | null;
  right: UnifiedDiffLine | null;
}

/** Pairs up a unified diff's removed/added lines into left/right rows for a side-by-side view. */
export function toSplitDiff(lines: UnifiedDiffLine[]): SplitDiffRow[] {
  const rows: SplitDiffRow[] = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].type === 'context') {
      rows.push({ left: lines[i], right: lines[i] });
      i++;
      continue;
    }

    const removed: UnifiedDiffLine[] = [];
    while (i < lines.length && lines[i].type === 'remove') {
      removed.push(lines[i]);
      i++;
    }
    const added: UnifiedDiffLine[] = [];
    while (i < lines.length && lines[i].type === 'add') {
      added.push(lines[i]);
      i++;
    }

    const max = Math.max(removed.length, added.length);
    for (let j = 0; j < max; j++) {
      rows.push({ left: removed[j] ?? null, right: added[j] ?? null });
    }
  }
  return rows;
}
