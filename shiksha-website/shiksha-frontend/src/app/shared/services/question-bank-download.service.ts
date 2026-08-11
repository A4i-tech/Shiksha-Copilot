import { Injectable } from '@angular/core';
import { isOrDividerAfter } from 'src/app/shared/utility/question-bank-display.util';
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
  ImageRun,
} from 'docx';
import { saveAs } from 'file-saver';
import { imageSize } from 'image-size';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DOCX_CONFIG, formatMarks } from '../utility/constant.util';
import { OptionDto, QuestionSectionDto } from '../models/question-bank.dto';
import { TranslateService } from '@ngx-translate/core';
import { DocxUtilityService } from './docx-utility.service';

export interface QuestionBankMetadata {
  schoolName: string;
}

export interface QuestionBankQuestion {
  question?: string;
  text?: string;
  options?: OptionDto[];
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
  // Equal to numberOfQuestions = no choice (answer all). Always present:
  // the backend backfills it on legacy papers and validation requires it.
  answerCount: number;
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
  questionTypeLabels: Record<string, string>;
}

const COLOR_ANSWER = '2E7D32';

@Injectable({
  providedIn: 'root',
})
export class QuestionBankDownloadService {
  constructor(private utilityService: UtilityService, private translateService: TranslateService, private docxUtility: DocxUtilityService) {}

  /** Public method to download the Question Bank */
  downloadQuestionBank(data: QuestionBankData) {
    const children = this.buildContent(data.questionBank.questions, false, data.questionTypeLabels);
    const doc = this.createDocument(data, children, '');
    this.saveDocument(doc, `${data.subject}_QuestionBank.docx`);
  }

  /** Public method to download the Answer Key */
  downloadAnswerKey(data: QuestionBankData) {
    const children = this.buildContent(data.questionBank.questions, true, data.questionTypeLabels);
    const doc = this.createDocument(data, children, ' - ANSWER KEY');
    this.saveDocument(doc, `${data.subject}_AnswerKey.docx`);
  }

  /** Unified content builder for both Bank and Answer Key */
  private buildContent(sections: QuestionBankSection[] | QuestionSectionDto[], showAnswers: boolean, questionTypeLabels: Record<string, string>): (Paragraph | Table)[] {
    const content: (Paragraph | Table)[] = [];
    let sectionCount = 1;

    for (const section of sections) {
      const roman = this.utilityService.intToRoman(sectionCount);
      content.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${roman}. ${this.translateService.instant(questionTypeLabels[section.type] || section.type)}`, bold: true }),
            new TextRun({
              text: `\t${section.answerCount} X ${formatMarks(section.marksPerQuestion)} = ${formatMarks(section.answerCount * section.marksPerQuestion)}`,
              bold: true,
            }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: 9000 }],
          spacing: DOCX_CONFIG.spacing.sectionHeader,
        })
      );

      if (section.answerCount < section.numberOfQuestions) {
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `\t${this.translateService.instant('Answer any')} ${section.answerCount} ${this.translateService.instant('of')} ${section.numberOfQuestions}`,
                bold: true,
                italics: true,
              }),
            ],
            spacing: DOCX_CONFIG.spacing.sectionHeader,
          })
        );
      }

      if (section.type === 'MATCHING') {
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
    const row = (left: any, right: any, bold = false) => new TableRow({
      children: [left, right].map(content => new TableCell({
        width: { size: 50, type: WidthType.PERCENTAGE },
        children: [new Paragraph({
          children: bold
            ? [new TextRun({ text: content, bold: true })]
            : this.contentRuns(content),
          spacing: DOCX_CONFIG.spacing.tableCell,
        })],
      })),
    });

    const left = questions.map(q => q.value1 ?? q.left ?? q.text);
    const answers = questions.map(q => q.value2 ?? q.right ?? q.keyAnswer);
    const right = shuffle ? this.utilityService.shuffleOptions([...answers]) : answers;
    const rows = left.map((value, index) => row(value, right[index]));

    if (!shuffle) rows.unshift(row('Left', 'Right (Answer)', true));

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows,
    });
  }

  /** Builds standard questions with optional answers */
  private buildStandardQuestions(questions: QuestionBankQuestion[], showAnswers: boolean): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    questions.forEach((q, index) => {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: `${index + 1}. ` }), ...this.contentRuns(q.question ?? q.text)],
          spacing: DOCX_CONFIG.spacing.questionItem,
        })
      );

      // Options render in both the standard bank and answer-key layouts so that
      // objective questions retain context alongside their answers.
      if (q.options) {
        q.options.forEach((opt: OptionDto, i: number) => {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${DOCX_CONFIG.indent.optionLeft}${opt.label || String.fromCharCode(65 + i)}. ` }),
                ...this.contentRuns(opt.text),
              ],
              spacing: DOCX_CONFIG.spacing.optionItem,
            })
          );
        });
      }

      if (showAnswers) {
        if (q.keyAnswer) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: `   ${this.translateService.instant('Hint')}: `, bold: true, color: COLOR_ANSWER }),
                ...this.contentRuns(q.keyAnswer),
              ],
              spacing: DOCX_CONFIG.spacing.optionItem,
            })
          );
        }
      }

      if (isOrDividerAfter(questions, index)) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: this.translateService.instant('OR'), italics: true })],
            alignment: AlignmentType.CENTER,
            spacing: DOCX_CONFIG.spacing.optionItem,
          })
        );
      }
    });

    return paragraphs;
  }

  private contentRuns(content: any): any[] {
    if (!Array.isArray(content)) return this.docxUtility.getTextRunsWithMath(content);
    return content.flatMap(item => {
      if (item.contentType === 'text/plain') return this.docxUtility.getTextRunsWithMath(item.content);
      const type: 'jpg' | 'png' = item.contentType === 'image/jpeg' ? 'jpg' : 'png';
      const data = Uint8Array.from(atob(item.content), c => c.charCodeAt(0));
      const { width = 240, height = 160 } = imageSize(data);
      return [new ImageRun({ type, data, transformation: { width: 240, height: 240 * height / width } })];
    });
  }

  /** Shared Document Shell */
  private createDocument(data: QuestionBankData, children: (Paragraph | Table)[], subtitleSuffix: string): Document {
    let totalMarks = 0;
    for (const section of data.questionBank.questions as QuestionBankSection[]) {
      // Only the questions a student must answer count toward the paper total, so a
      // "answer any 5 of 7" section contributes 5 * marksPerQuestion, not 7.
      totalMarks += Number(section.answerCount) * Number(section.marksPerQuestion);
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
                    new TextRun({ text: `\tMarks: ${formatMarks(totalMarks)}`, bold: true }),
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
}
