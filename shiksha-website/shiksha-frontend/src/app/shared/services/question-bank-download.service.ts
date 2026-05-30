import { Injectable } from '@angular/core';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Footer,
  Header,
  Table,
  TableCell,
  TableRow,
  WidthType,
  PageNumber,
  TabStopType,
} from 'docx';
import { saveAs } from 'file-saver';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DOCX_CONFIG, SUPERSCRIPT_MAP } from '../utility/constant.util';
import { OptionDto, QuestionSectionDto } from '../models/question-bank.dto';

/** Interfaces for Question Bank Data */
export interface QuestionBankMetadata {
  schoolName: string;
}

export type QuestionBankOption = string | OptionDto;

export interface QuestionBankQuestion {
  question?: string;
  text?: string;
  options?: QuestionBankOption[];
  value1?: string;
  value2?: string;
  left?: string;
  right?: string;
  keyAnswer?: string;
}

export interface QuestionBankSection {
  type: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
  questions: QuestionBankQuestion[];
}

export interface QuestionBankData {
  questionBank: {
    metadata: QuestionBankMetadata;
    questions: QuestionBankSection[] | QuestionSectionDto[];
  };
  examinationName: string;
  subject: string;
  grade: string;
  totalMarks: number;
}

const COLOR_ANSWER = '2E7D32';

@Injectable({
  providedIn: 'root',
})
export class QuestionBankDownloadService {
  constructor(private utilityService: UtilityService) {}

  /** Public method to download the Question Bank */
  downloadQuestionBank(data: QuestionBankData) {
    const children = this.buildContent(data.questionBank.questions, false);
    const doc = this.createDocument(data, children, '');
    this.saveDocument(doc, `${data.subject}_QuestionBank.docx`);
  }

  /** Public method to download the Answer Key */
  downloadAnswerKey(data: QuestionBankData) {
    const children = this.buildContent(data.questionBank.questions, true);
    const doc = this.createDocument(data, children, ' - ANSWER KEY');
    this.saveDocument(doc, `${data.subject}_AnswerKey.docx`);
  }

  /** Unified content builder for both Bank and Answer Key */
  private buildContent(sections: QuestionBankSection[] | QuestionSectionDto[], showAnswers: boolean): (Paragraph | Table)[] {
    const content: (Paragraph | Table)[] = [];
    let sectionCount = 1;

    for (const section of sections) {
      const roman = this.utilityService.intToRoman(sectionCount);
      content.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${roman}. ${section.type}`, bold: true }),
            new TextRun({
              text: `\t${section.numberOfQuestions} X ${section.marksPerQuestion} = ${
                section.numberOfQuestions * section.marksPerQuestion
              }`,
              bold: true,
            }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: 9000 }],
          spacing: DOCX_CONFIG.spacing.sectionHeader,
        })
      );

      if (section.type === 'Match the following') {
        content.push(this.buildMatchTable(section.questions, !showAnswers));
      } else {
        content.push(...this.buildStandardQuestions(section.questions, showAnswers));
      }

      content.push(new Paragraph({ text: '' }));
      sectionCount++;
    }

    return content;
  }

  /** Builds a table for Match the Following questions */
  private buildMatchTable(questions: QuestionBankQuestion[], shuffle: boolean): Table {
    const rows: TableRow[] = [];

    // Header Row (Only for Answer Key as per original logic, let's keep it consistent)
    if (!shuffle) {
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: ' Left', bold: true })],
                  spacing: DOCX_CONFIG.spacing.tableCell,
                }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: ' Right (Answer)', bold: true })],
                  spacing: DOCX_CONFIG.spacing.tableCell,
                }),
              ],
            }),
          ],
        })
      );
    }

    const col1 = questions.map((q) => (q.value1 ?? q.left ?? q.text ?? '') || '');
    const rawCol2 = questions.map((q, idx) => {
      const resolved = q.value2 ?? q.right ?? q.keyAnswer;
      if (typeof resolved !== 'string' || resolved.trim() === '') {
        console.warn(
          `[QuestionBankDownloadService.buildMatchTable] Row ${idx}: no valid right-hand match value found ` +
            `(value2/right/keyAnswer). Falling back to empty string.`,
          q
        );
        return '';
      }
      return resolved;
    });
    const col2 = shuffle ? this.utilityService.shuffleOptions([...rawCol2]) : rawCol2;

    for (let i = 0; i < col1.length; i++) {
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: this.convertToDocxRuns(col1[i]),
                  spacing: DOCX_CONFIG.spacing.tableCell,
                }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: this.convertToDocxRuns(col2[i]),
                  spacing: DOCX_CONFIG.spacing.tableCell,
                }),
              ],
            }),
          ],
        })
      );
    }

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows,
    });
  }

  /** Builds standard questions with optional answers */
  private buildStandardQuestions(questions: QuestionBankQuestion[], showAnswers: boolean): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    questions.forEach((q, index) => {
      const questionText = q.question ?? q.text ?? '';
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: `${index + 1}. ` }), ...this.convertToDocxRuns(questionText)],
          spacing: DOCX_CONFIG.spacing.questionItem,
        })
      );

      // Options render in both the standard bank and answer-key layouts so that
      // objective questions retain context alongside their answers.
      if (q.options) {
        q.options.forEach((opt: QuestionBankOption, i: number) => {
          const { label, text } = this.decodeOption(opt, i);
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${DOCX_CONFIG.indent.optionLeft}${label}. ` }),
                ...this.convertToDocxRuns(text),
              ],
              spacing: DOCX_CONFIG.spacing.optionItem,
            })
          );
        });
      }

      if (showAnswers) {
        let answer = '';
        if (typeof q.keyAnswer === 'string') {
          answer = q.keyAnswer;
        } else if (q.keyAnswer !== undefined && q.keyAnswer !== null) {
          console.error(
            `[QuestionBankDownloadService.buildStandardQuestions] Question ${index + 1}: keyAnswer is not a string ` +
              `(got ${typeof q.keyAnswer}). Falling back to empty string to prevent docx failure.`,
            q
          );
        }
        if (answer) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: '   Ans: ', bold: true, color: COLOR_ANSWER }),
                new TextRun({ text: answer, italics: true, color: COLOR_ANSWER }),
              ],
              spacing: DOCX_CONFIG.spacing.optionItem,
            })
          );
        }
      }
    });

    return paragraphs;
  }

  /**
   * Decodes a single MCQ option into { label, text }, mirroring the preview pattern used in
   * `question-bank-blue-print.component.html` so downloads never render `[object Object]`.
   * Supports three shapes:
   *   - { label, text } → label from data, text from data
   *   - { text }        → label auto-assigned (A, B, C…), text from data
   *   - primitive       → label auto-assigned, text is the primitive coerced to string
   */
  private decodeOption(opt: QuestionBankOption | null | undefined, index: number): { label: string; text: string } {
    const autoLabel = String.fromCharCode(65 + index);

    if (opt && typeof opt === 'object') {
      const label = typeof opt.label === 'string' && opt.label.trim() !== '' ? opt.label : autoLabel;
      if (typeof opt.text === 'string') {
        return { label, text: opt.text };
      }
      console.warn(
        `[QuestionBankDownloadService.decodeOption] Option ${index} is an object without a string 'text' field. ` +
          `Falling back to empty string.`,
        opt
      );
      return { label, text: '' };
    }

    return { label: autoLabel, text: opt == null ? '' : String(opt) };
  }

  /** Shared Document Shell */
  private createDocument(data: QuestionBankData, children: (Paragraph | Table)[], subtitleSuffix: string): Document {
    let totalMarks = 0;
    for (const section of data.questionBank.questions as QuestionBankSection[]) {
      totalMarks += Number(section.numberOfQuestions || 0) * Number(section.marksPerQuestion || 0);
    }
    return new Document({
      sections: [
        {
          headers: {
            first: new Header({
              children: [
                new Paragraph({
                  text: data.questionBank.metadata.schoolName,
                  heading: HeadingLevel.HEADING_1,
                  alignment: AlignmentType.CENTER,
                  spacing: DOCX_CONFIG.spacing.sectionHeader,
                }),
                new Paragraph({
                  text: `${data.examinationName}${subtitleSuffix}`,
                  heading: HeadingLevel.HEADING_2,
                  alignment: AlignmentType.CENTER,
                  spacing: DOCX_CONFIG.spacing.sectionHeader,
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: `Subject: ${data.subject}`, bold: true }),
                    new TextRun({ text: `\tClass: ${data.grade}`, bold: true }),
                    new TextRun({ text: `\tMarks: ${totalMarks}`, bold: true }),
                  ],
                  tabStops: [
                    { type: TabStopType.CENTER, position: 4500 },
                    { type: TabStopType.RIGHT, position: 9000 },
                  ],
                  spacing: DOCX_CONFIG.spacing.sectionHeader,
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ children: ['Page ', PageNumber.CURRENT] })],
                }),
              ],
            }),
          },
          properties: { titlePage: true },
          children,
        },
      ],
    });
  }

  /** Saves the document as a blob */
  private saveDocument(doc: Document, fileName: string) {
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, fileName);
    });
  }

  convertToDocxRuns(text: string): TextRun[] {
    if (!text || typeof text !== 'string') {
      console.warn('[WARNING] convertToDocxRuns: expected string but received', typeof text);
      return [new TextRun({ text: text != null ? String(text) : '' })];
    }

    const runs: TextRun[] = [];
    const regex = /\^([a-zA-Z0-9()+\-]+)/g;
    let lastIndex = 0;

    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        runs.push(new TextRun({ text: text.substring(lastIndex, match.index) }));
      }
      const exponent = match[1];
      const allMapped = [...exponent].every(ch => ch in SUPERSCRIPT_MAP);
      if (!allMapped) {
        console.warn('[WARNING] convertToDocxRuns: unmapped superscript characters in exponent:', exponent);
      }
      runs.push(new TextRun({ text: exponent, superScript: true }));
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      runs.push(new TextRun({ text: text.substring(lastIndex) }));
    }

    return runs;
  }
}
