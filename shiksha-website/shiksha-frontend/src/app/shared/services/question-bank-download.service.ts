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
  IRunOptions
} from 'docx';
import { saveAs } from 'file-saver';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DOCX_CONFIG, SUPERSCRIPT_MAP } from '../utility/constant.util';
import { QuestionDto, QuestionSectionDto } from '../models/question-bank.dto';

@Injectable({
  providedIn: 'root',
})
export class QuestionBankDownloadService {
  constructor(private utilityService: UtilityService) {}

  downloadQuestionBank(data: any) {
    const doc = new Document({
      sections: [{
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
                text: data.examinationName,
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.CENTER,
                spacing: DOCX_CONFIG.spacing.sectionHeader,
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Subject: ${data.subject}`, bold: true }),
                  new TextRun({ text: "\tClass: " + data.grade, bold: true }),
                  new TextRun({ text: "\tMarks: " + data.totalMarks, bold: true }),
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
                children: [new TextRun({ children: ["Page ", PageNumber.CURRENT]})],
              }),
            ],
          }),
        },
        properties: {
          titlePage: true
        },
        children: this.buildQuestions(data.questionBank.questions)
      }],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${data.subject}_QuestionBank.docx`);
    });
  }

  private buildQuestions(questionsArray: QuestionSectionDto[]) {
    const content: (Paragraph | Table)[] = [];
    let sectionCount = 1;

    for (const section of questionsArray) {
      const roman = this.utilityService.intToRoman(sectionCount);
      content.push(new Paragraph({
        children: [
          new TextRun({ text: `${roman}. ${section.type}`, bold: true }),
          new TextRun({ text: `\t${section.numberOfQuestions} X ${section.marksPerQuestion} = ${section.numberOfQuestions * section.marksPerQuestion}`, bold: true }),
        ],
        tabStops: [
          { type: TabStopType.RIGHT, position: 9000 },
        ],
        spacing: DOCX_CONFIG.spacing.sectionHeader,
      }));

      if (section.type !== 'Match the following') {
        section.questions.forEach((q: QuestionDto, index: number) => {
          if (q.question) {
            content.push(new Paragraph({
              children: [
                new TextRun({ text: `${index + 1}. ` }),
                ...this.convertToDocxRuns(q.question)
              ],
              spacing: DOCX_CONFIG.spacing.questionItem,
            }));
            if (q.options) {
              q.options.forEach((opt: string | { text?: string; label?: string }, i: number) => {
                const optText = typeof opt === 'string' ? opt : (opt.text || opt.label || String(opt));
                content.push(new Paragraph({
                  children: [
                    new TextRun({ text: `${DOCX_CONFIG.indent.optionLeft}${String.fromCharCode(65 + i)}. ` }),
                    ...this.convertToDocxRuns(optText)
                  ],
                  spacing: DOCX_CONFIG.spacing.optionItem,
                }));
              });
            }
          }
        });
      } else {
        const colOneValue = section.questions.map((e: QuestionDto) => e.value1 || '');
        const colTwoVal = structuredClone(section.questions.map((e: QuestionDto) => e.value2 || ''));
        const shuffledColumns = this.utilityService.shuffleOptions(colTwoVal);
        content.push(this.buildMatchTable(colOneValue, shuffledColumns));
      }

      content.push(new Paragraph({ text: "" }));
      sectionCount++;
    }

    return content;
  }

  private buildMatchTable(col1: string[], col2: string[]) {
    const rows: TableRow[] = [];

    for (let i = 0; i < col1.length; i++) {
      rows.push(new TableRow({
        children: [
          new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({
            children: this.convertToDocxRuns(col1[i]),
            spacing: DOCX_CONFIG.spacing.tableCell,
          })] }),
          new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({
            children: this.convertToDocxRuns(col2[i]),
            spacing: DOCX_CONFIG.spacing.tableCell,
          })] }),
        ],
      }));
    }

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        ...rows,
      ],
    });
  }

  tokenizeForDocxRuns(text: string): IRunOptions[] {
    if (!text || typeof text !== 'string') {
      console.warn('[WARNING] tokenizeForDocxRuns: expected string but received', typeof text);
      return [{ text: text != null ? String(text) : '' }];
    }

    const runs: IRunOptions[] = [];
    const regex = /\^([a-zA-Z0-9()+\-]+)/g;
    let lastIndex = 0;

    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        runs.push({ text: text.substring(lastIndex, match.index) });
      }
      const exponent = match[1];
      const allMapped = [...exponent].every(ch => ch in SUPERSCRIPT_MAP);
      if (!allMapped) {
        console.warn('[WARNING] tokenizeForDocxRuns: unmapped superscript characters in exponent:', exponent);
      }
      runs.push({ text: exponent, superScript: true });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      runs.push({ text: text.substring(lastIndex) });
    }

    return runs;
  }

  convertToDocxRuns(text: string): TextRun[] {
    return this.tokenizeForDocxRuns(text).map(o => new TextRun(o));
  }
}
