import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import {
  ActivitySection,
  AssessmentGroup,
  ChecklistSection,
  McqGroup,
  PHASES,
  PlainTextSection,
  QuestionBankSection,
  ScenarioLevel,
  ScenarioSection,
  Section,
  blankActivity,
  blankAssessmentQuestion,
  blankMcq,
  blankScenario,
} from '../../utility/section-content.util';

@Component({
  selector: 'app-section-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './section-editor.component.html',
})
export class SectionEditorComponent {
  @Input({ required: true }) section!: Section;

  readonly phases = PHASES;
  readonly optionLabels = ['A', 'B', 'C', 'D'];

  get plainText(): PlainTextSection {
    return this.section as PlainTextSection;
  }

  get checklist(): ChecklistSection {
    return this.section as ChecklistSection;
  }

  get questionBank(): QuestionBankSection {
    return this.section as QuestionBankSection;
  }

  get scenarios(): ScenarioSection {
    return this.section as ScenarioSection;
  }

  get activities(): ActivitySection {
    return this.section as ActivitySection;
  }

  isMcqGroup(group: McqGroup | AssessmentGroup): group is McqGroup {
    return group.type === 'MCQs';
  }

  addMcq(group: McqGroup): void {
    group.questions.push(blankMcq());
  }

  removeMcq(group: McqGroup, index: number): void {
    group.questions.splice(index, 1);
  }

  addAssessment(group: AssessmentGroup): void {
    group.questions.push(blankAssessmentQuestion());
  }

  removeAssessment(group: AssessmentGroup, index: number): void {
    group.questions.splice(index, 1);
  }

  addScenario(level: ScenarioLevel): void {
    level.content.push(blankScenario());
  }

  removeScenario(level: ScenarioLevel, index: number): void {
    level.content.splice(index, 1);
  }

  addActivity(): void {
    this.activities.content.push(blankActivity(this.activities.content));
  }

  removeActivity(index: number): void {
    this.activities.content.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
