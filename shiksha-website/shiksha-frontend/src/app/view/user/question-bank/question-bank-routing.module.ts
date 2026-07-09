import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionBankListComponent } from './question-bank-list/question-bank-list.component';
import { QuestionBankGenerationComponent } from './question-bank-generation/question-bank-generation.component';
import { QuestionBankViewComponent } from './question-bank-view/question-bank-view.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionBankListComponent,
    data: {
      trackingTag: 'question-paper-list',
      idleTracking: 'custom',
    },
  },
  {
    path: 'generate',
    component: QuestionBankGenerationComponent,
    data: {
      trackingTag: 'question-paper-generate',
    },
  },
  {
    path: 'view/:id',
    component: QuestionBankViewComponent,
    data: {
      trackingTag: 'view-question-bank',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class questionBankRoutingModule {}
