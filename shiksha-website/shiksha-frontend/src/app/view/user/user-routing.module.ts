import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { PermissionGuard } from 'src/app/core/guards/permission.guard';
import { IsProfileCompleteGuard } from 'src/app/core/guards/isProfileComplete.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { BaselineSurveyGuard } from 'src/app/core/guards/baseline-survey.guard';
import { GenerationStatusComponent } from './generation-status/generation-status.component';
import { EndlineSurveyGuard } from 'src/app/core/guards/endline-survey.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component:DashboardComponent,
    data: {
      permissions: ['standard', 'power'],
    },
    canActivate: [PermissionGuard, IsProfileCompleteGuard, BaselineSurveyGuard, EndlineSurveyGuard],
  },
  {
    path: 'content-generation',
    loadChildren: () =>
      import('./content-generation/content-generation.module').then(
        (m) => m.ContentGenerationModule
      ),
    data: {
      permissions: ['standard', 'power'],
    },
    canActivate: [PermissionGuard, IsProfileCompleteGuard, BaselineSurveyGuard, EndlineSurveyGuard],
  },
  {
    path: 'generation-status',
    component:GenerationStatusComponent,
    data: {
      permissions: ['power'],
    },
    canActivate: [PermissionGuard, IsProfileCompleteGuard, BaselineSurveyGuard, EndlineSurveyGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: {
      permissions: ['standard', 'power'],
    },
    canActivate: [PermissionGuard, EndlineSurveyGuard],
  },
  {
    path: 'chatbot',
    component:ChatbotComponent,
    data: {
      permissions: ['power'],
      type:'general'
    },
    canActivate: [PermissionGuard, IsProfileCompleteGuard, BaselineSurveyGuard, EndlineSurveyGuard],
  },
  {
    path: 'question-paper',
    loadChildren:()=> import('./question-bank/question-bank.module').then(m=>m.QuestionBankModule),
    data: {
      permissions: ['standard', 'power'],
    },
    canActivate: [PermissionGuard, IsProfileCompleteGuard, BaselineSurveyGuard, EndlineSurveyGuard],
  },
  {
    path: 'schedule',
    loadChildren: () =>
      import('./schedule/schedule.module').then((m) => m.ScheduleModule),
    data: {
      permissions: ['standard', 'power'],
    },
    canActivate: [PermissionGuard, IsProfileCompleteGuard, BaselineSurveyGuard, EndlineSurveyGuard],
  },
  {
    path: 'help',
    loadComponent:()=> import('./help/help.component').then((c)=>c.HelpComponent),
    data: {
      permissions: ['standard', 'power'],
    },
    canActivate: [PermissionGuard, EndlineSurveyGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
