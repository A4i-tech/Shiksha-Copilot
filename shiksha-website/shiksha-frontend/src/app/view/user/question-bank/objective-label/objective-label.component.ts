import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { QuestionBankObjective } from '../question-bank-generation/question-bank-generation.model';

@Component({
  selector: 'app-objective-label',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './objective-label.component.html',
})
export class ObjectiveLabelComponent {
  @Input() objective!: QuestionBankObjective;

  helpOpen = false;
}
