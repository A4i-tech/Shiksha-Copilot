import { Injectable } from '@angular/core';
import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { DocxContext, DocxUtilityService } from './docx-utility.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentExportService {
  constructor(private docxUtility: DocxUtilityService) {}

  downloadDoc(
    data: any[],
    headerData: any,
    filename: string = 'output.docx'
  ): void {
    const documentContent: Paragraph[] = [];
    const context = new DocxContext()

    for (const [index, section] of data.entries()) {
      const sectionContent: Paragraph[] = [];

      // Section Title
      sectionContent.push(
        new Paragraph({
          text: section.title.toUpperCase(),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: index === 0 ? 0 : 240, after: 240 },
        })
      );

      switch (section.outputFormat) {
        case 'plain_text':
          sectionContent.push(...this.docxUtility.getMarkdownParagraphs(section.content, context));
          break;
        case 'json_1':
          sectionContent.push(...this.formatQuestionBank(section.content, context));
          break;
        case 'json_2':
          sectionContent.push(
            ...this.formatRealWorldScenarios(section.content, context)
          );
          break;
        case 'json_3':
          sectionContent.push(...this.formatActivities(section.content, context));
          break;
        default:
          sectionContent.push(new Paragraph({ text: 'Unsupported content format.' }));
      }

      // Add spacing between sections
      sectionContent.push(new Paragraph({ text: '', spacing: { after: 300 } }));

      documentContent.push(...sectionContent);
    }

    const doc = new Document({
      numbering: this.docxUtility.getMarkdownNumbering(),
      sections: [
        {
          children: documentContent,
          headers: this.docxUtility.getHeader(headerData),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, filename);
    });
  }

  private formatQuestionBank(content: any[], context: DocxContext): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    content.forEach((level) => {
      paragraphs.push(
        new Paragraph({
          text: level.difficulty.toUpperCase(),
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        })
      );

      level.content.forEach((block: any) => {
        paragraphs.push(
          new Paragraph({
            text: block.type.toUpperCase(),
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 150 },
          })
        );

        block.questions.forEach((q: any, index: any) => {
          paragraphs.push(
            ...this.docxUtility.getMarkdownParagraphs(`**${index + 1}.** ${q.question}`, context)
          );

          if (q.options) {
            paragraphs.push(
              ...this.docxUtility.getMarkdownParagraphs(q.options.map((opt: any) => `- ${opt}`).join('\n'), context)
            );
          }

          // Add small gap after each question
          paragraphs.push(new Paragraph({ text: '', spacing: { after: 100 } }));
        });
      });

      // Gap after each difficulty level
      paragraphs.push(new Paragraph({ text: '', spacing: { after: 200 } }));
    });

    return paragraphs;
  }

  private formatRealWorldScenarios(content: any[], context: DocxContext): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    content.forEach((level) => {
      paragraphs.push(
        new Paragraph({
          text: level.difficulty.toUpperCase(),
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        })
      );

      level.content.forEach((item: any) => {
        paragraphs.push(
          new Paragraph({
            text: item.title,
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 150 },
          })
        );

        paragraphs.push(...this.docxUtility.getMarkdownParagraphs(`**Q:** ${item.question}`, context));
        paragraphs.push(...this.docxUtility.getMarkdownParagraphs(item.description, context));
      });
    });

    return paragraphs;
  }

  private formatActivities(content: any[], context: DocxContext): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    content.forEach((activity) => {
      paragraphs.push(
        new Paragraph({
          text: activity.title,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        })
      );

      paragraphs.push(
        new Paragraph({
          text: 'Preparation:',
          spacing: { after: 100 },
        })
      );
      paragraphs.push(...this.docxUtility.getMarkdownParagraphs(activity.preparation, context));

      paragraphs.push(
        new Paragraph({
          text: 'Required Materials:',
          spacing: { after: 100 },
        })
      );
      const requiredMaterials = Array.isArray(activity.required_materials)
        ? activity.required_materials.map((material: string) => `- ${material}`).join('\n')
        : activity.required_materials;
      paragraphs.push(...this.docxUtility.getMarkdownParagraphs(requiredMaterials, context));

      paragraphs.push(
        new Paragraph({
          text: 'Obtaining Materials:',
          spacing: { after: 100 },
        })
      );
      paragraphs.push(...this.docxUtility.getMarkdownParagraphs(activity.obtaining_materials, context));

      paragraphs.push(
        new Paragraph({
          text: 'Recap:',
          spacing: { after: 100 },
        })
      );
      paragraphs.push(...this.docxUtility.getMarkdownParagraphs(activity.recap, context));
    });

    return paragraphs;
  }
}
