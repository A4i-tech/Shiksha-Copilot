import { Component } from '@angular/core';
import { LessonPlanResourceDetailsComponent } from 'src/app/shared/components/lesson-plan-resource-details/lesson-plan-resource-details.component';

// A routed component cannot set an @Input, so this host sets the chapter source of the shared form.
@Component({
  selector: 'app-curator-chapter-pick',
  template: '<app-lesson-plan-resource-details [curatorMode]="true"></app-lesson-plan-resource-details>',
  standalone: true,
  imports: [LessonPlanResourceDetailsComponent],
})
export class CuratorChapterPickComponent {}
