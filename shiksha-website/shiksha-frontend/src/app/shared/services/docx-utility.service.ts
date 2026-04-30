import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  AlignmentType,
  BorderStyle,
  Header,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';
import { marked } from 'marked';
import { UtilityService } from 'src/app/core/services/utility.service';

@Injectable({
  providedIn: 'root',
})
export class DocxUtilityService {
  constructor(private utilityService:UtilityService, private translateService:TranslateService){}

  getMarkdownParagraphs(content: string = ''): Paragraph[] {
    const toRuns = (tokens: any[]): TextRun[] => {
      return tokens.flatMap((token) => {
        switch (token.type) {
          case 'strong':
            return [new TextRun({ text: token.text, bold: true })];
          case 'em':
            return [new TextRun({ text: token.text, italics: true })];
          case 'br':
            return [new TextRun({ text: '', break: 1 })];
          default:
            return token.tokens ? toRuns(token.tokens) : [new TextRun(token.text || '')];
        }
      });
    };

    const toParagraphs = (tokens: any[], level = 0): Paragraph[] => {
      return tokens.flatMap((token) => {
        if (token.type === 'space') {
          return [];
        }

        if (token.type === 'list') {
          const reference = token.ordered ? 'markdown-numbered' : 'markdown-bullets';

          return token.items.flatMap((item: any) => [
            new Paragraph({
              numbering: { reference, level: Math.min(level, 8) },
              children: toRuns(item.tokens.filter((t: any) => t.type !== 'list')),
              spacing: { after: 40 },
            }),
            ...toParagraphs(item.tokens.filter((t: any) => t.type === 'list'), level + 1),
          ]);
        }

        return [
          new Paragraph({
            heading: token.type === 'heading' ? HeadingLevel[`HEADING_${Math.min(token.depth, 6)}` as keyof typeof HeadingLevel] : undefined,
            children: toRuns(token.tokens || [token]),
            spacing: { after: 100 },
          }),
        ];
      });
    };

    return toParagraphs(marked.lexer(content));
  }

  getMarkdownNumbering() {
    const levels = (format: any, text: (level: number) => string) =>
      Array.from({ length: 9 }, (_, level) => ({
        level,
        format,
        text: text(level),
        alignment: AlignmentType.LEFT,
        style: {
          paragraph: {
            indent: { left: 360 + level * 360, hanging: 180 },
          },
        },
      }));

    return {
      config: [
        { reference: 'markdown-bullets', levels: levels(LevelFormat.BULLET, () => '•') },
        { reference: 'markdown-numbered', levels: levels(LevelFormat.DECIMAL, (level) => `%${level + 1}.`) },
      ],
    };
  }

  /**
   * Function to download doc file
   * @param doc
   * @param fileName
   */
  downloadFile(doc: any, fileName: any) {
    Packer.toBlob(doc).then((blob) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName + '.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.utilityService.showSuccess('Document downloaded successfully!')
    }).catch(()=>{
      this.utilityService.showError('Something went wrong! Please try again later.')
    })
  }

  getLearningOutcomes(learningOutcomes:any[]){
    const loContent = learningOutcomes.map((item,i) => [
      new Paragraph({
          text: `${i + 1}. ${item}`,
          spacing: {
              before: 80,
              after: 80,
          },
      })
  ]).flat();

  // Define the content for the first page with checklist
  const learningOutcomesContent = [
      new Paragraph({
          text: this.translateService.instant('LEARNING OUTCOMES'),
          heading: HeadingLevel.HEADING_1,
          spacing:{
            after:300
          }
      }),
      ...loContent,
  ];

  return learningOutcomesContent
  }

  /**
   * Function to get footer data
   * @param formData 
   * @returns 
   */
  getHeader(formData: any) {
    const medium = formData?.medium ? formData.medium.charAt(0).toUpperCase() + formData.medium.slice(1) : '';
    const chapter = [formData?.orderNumber, formData?.topics].filter(Boolean).join('. ');
    const subTopics = Array.isArray(formData?.subTopics) ? formData.subTopics.join(', ') : formData?.subTopics || '';
    const subject = formData?.subjects ? this.utilityService.getSubjectDisplayName(formData.subjects) : '';
    return {
      default: new Header({
        children: [
          this.buildHeaderTitleLine(subject, chapter),
          this.buildHeaderMetaLine([
            [this.translateService.instant('Board'), formData?.board],
            [this.translateService.instant('Medium'), medium],
            [this.translateService.instant('Class'), formData?.class?.toString()],
            [this.translateService.instant('Sub-Topic'), subTopics],
          ]),
        ],
      }),
    };
  }

  private buildHeaderTitleLine(subject: string, chapter: string) {
    const items = [subject, chapter].filter(Boolean);
    return new Paragraph({
      children: items.flatMap((value, index) => [
        ...(index > 0 ? [new TextRun({ text: '  |  ', color: '7A7A7A', size: 17 })] : []),
        new TextRun({ text: value, bold: true, color: '1F2937', size: 18 }),
      ]),
      spacing: { before: 0, after: 10 },
    });
  }

  private buildHeaderMetaLine(items: [string, any][]) {
    return new Paragraph({
      children: items
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .flatMap(([label, value], index) => [
          ...(index > 0 ? [new TextRun({ text: '  |  ', color: 'B0B0B0', size: 14 })] : []),
          new TextRun({ text: `${label}: `, bold: true, color: '5F6368', size: 14 }),
          new TextRun({ text: value.toString(), color: '374151', size: 14 }),
        ]),
      spacing: { before: 0, after: 60 },
      border: {
        bottom: { color: 'D0D7DE', space: 4, style: BorderStyle.SINGLE, size: 3 },
      },
    });
  }
}
