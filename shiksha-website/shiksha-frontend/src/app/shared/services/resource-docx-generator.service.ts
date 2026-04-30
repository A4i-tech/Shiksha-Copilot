import { Injectable } from '@angular/core';
import { Document, Paragraph, HeadingLevel } from 'docx';
import { DocxUtilityService } from './docx-utility.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ResourceDocxService {
  resourceMapper: any = {
    activities: this.translateService.instant('ACTIVITIES'),
    questionbank: this.translateService.instant('QUESTION BANK'),
    realworldscenarios: this.translateService.instant('REAL WORLD SCENARIOS'),
  };

  constructor(private docxUtility: DocxUtilityService, private translateService:TranslateService) {}

  /**
   * Function to generate docx
   * @param data
   * @param type
   * @param fileName
   */
  generateDocx(data: any, formData: any, learningOutcomes:any[]) {
    const sections = [];

    for (const section of data) {
      const sectionChildren = [];
      sectionChildren.push(
        new Paragraph({
          text: this.resourceMapper[section.section],
          heading: HeadingLevel.HEADING_1,
        })
      );

      for (const item of section.data) {
        // Add difficulty level header for non-activities sections
        if (section.section !== 'activities') {
          sectionChildren.push(
            new Paragraph({
              text: `${
                this.translateService.instant(item.difficulty.charAt(0).toUpperCase() +
                item.difficulty.slice(1))
              }`,
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 200,
                after: 200,
              },
            })
          );
          if(item?.difficulty && item.content.length ===0){
            sectionChildren.push(
              new Paragraph({
                text:`${this.translateService.instant('No Data Available')}!`
              })
            )
          }

        }

        if (Array.isArray(item.content)) {
          // Handle MCQs and Assessments
          if (section.section === 'questionbank') {
            const contentChildren = item.content.flatMap((content: any) => {
              // Handle MCQs
              const mcqs =
                content.type === 'MCQs'
                  ? content.questions.flatMap(
                      (question: any, questionIndex: number) => {
                        const questionParagraph = question?.question
                          ? this.docxUtility.getMarkdownParagraphs(`**${questionIndex + 1}.** ${question.question}`)
                          : [];

                        const optionParagraphs = question?.options
                          ? this.docxUtility.getMarkdownParagraphs(
                              question.options.map((options: any) => `- ${options}`).join('\n')
                            )
                          : [];
                        return [...questionParagraph, ...optionParagraphs];
                      }
                    )
                  : [];

              // Handle Assessments
              const assessments =
                content.type === 'assessment'
                  ? content.questions.flatMap(
                      (question: any, questionIndex: number) => {
                        return question.question
                          ? this.docxUtility.getMarkdownParagraphs(`**${questionIndex + 1}.** ${question.question}`)
                          : [];
                      }
                    )
                  : [];

              // Add heading for MCQs or Assessments
              const contentHeading =
                content.type === 'MCQs'
                  ? new Paragraph({
                      text: this.translateService.instant('MCQs'),
                      heading: HeadingLevel.HEADING_3,
                      spacing: {
                        before: 40,
                        after: 20,
                      },
                    })
                  : content.type === 'assessment'
                  ? new Paragraph({
                      text: this.translateService.instant('Assessments'),
                      heading: HeadingLevel.HEADING_3,
                      spacing: {
                        before: 40,
                        after: 20,
                      },
                    })
                  : null;

              return [contentHeading, ...mcqs, ...assessments].filter(Boolean); // Filter out any null values
            });

            sectionChildren.push(...contentChildren);
          } else if (section.section === 'realworldscenarios') {
            // Handle Real World Scenarios
            const realWorldScenariosChildren = item.content.flatMap(
              (scenario: any) => {
                // Add heading for the real world scenario
                const scenarioTitle = new Paragraph({
                  text: scenario.title,
                  heading: HeadingLevel.HEADING_3,
                  spacing: {
                    before: 40,
                    after: 20,
                  },
                });

                const questionParagraph = this.docxUtility.getMarkdownParagraphs(scenario.question);
                const descriptionParagraph = this.docxUtility.getMarkdownParagraphs(scenario.description);

                return [scenarioTitle, ...questionParagraph, ...descriptionParagraph];
              }
            );

            sectionChildren.push(...realWorldScenariosChildren);
          }
        } else if (section.section === 'activities') {
          // Handle activities with the new structure
          sectionChildren.push(
            new Paragraph({
              text: item.title,
              heading: HeadingLevel.HEADING_3,
              spacing:{
                before:200
              }
            })
          );

          if (item.preparation) {
            sectionChildren.push(...this.docxUtility.getMarkdownParagraphs(item.preparation));
          }

          if (item.required_materials) {
            sectionChildren.push(...this.docxUtility.getMarkdownParagraphs(item.required_materials));
          }

          if (item.obtaining_materials) {
            sectionChildren.push(...this.docxUtility.getMarkdownParagraphs(item.obtaining_materials));
          }

          if (item.recap) {
            sectionChildren.push(...this.docxUtility.getMarkdownParagraphs(item.recap));
          }
        }
      }

      sections.push({
        children: sectionChildren,
        headers: this.docxUtility.getHeader(formData),
      });
    }

    const doc = new Document({
      numbering: this.docxUtility.getMarkdownNumbering(),
      sections: [
        {
            children: this.docxUtility.getLearningOutcomes(learningOutcomes),
            headers: this.docxUtility.getHeader(formData),
        },
        ...sections.flat(),
    ]
    });
    this.docxUtility.downloadFile(doc, `${formData?.subjects?.name}_Sem${formData?.subjects?.sem}_${formData?.chapter?.topics }`);
  }
}
