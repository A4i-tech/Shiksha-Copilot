import { Component, Input } from '@angular/core';
import { formatMarks } from 'src/app/shared/utility/constant.util';
import { difficultyColor, hasQuestionImage, sourceTagClass } from 'src/app/shared/utility/question-bank-display.util';

@Component({
  selector: 'app-question-tags',
  templateUrl: './question-tags.component.html',
})
export class QuestionTagsComponent {
  @Input() question: any;
  readonly formatMarks = formatMarks;
  readonly hasQuestionImage = hasQuestionImage;
  readonly difficultyColor = difficultyColor;
  readonly sourceTagClass = sourceTagClass;
}
