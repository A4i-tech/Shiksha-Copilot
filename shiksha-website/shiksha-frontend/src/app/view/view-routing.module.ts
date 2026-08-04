import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../core/guards/permission.guard';
import { IsProfileCompleteGuard } from '../core/guards/isProfileComplete.guard';
import { BaselineSurveyGuard } from '../core/guards/baseline-survey.guard';
import { EndlineSurveyGuard } from '../core/guards/endline-survey.guard';
import { ViewComponent } from './view.component';
import { DashboardComponent as TeacherDashboardComponent } from './user/dashboard/dashboard.component';
import { ProfileComponent } from './user/profile/profile.component';
import { GenerationStatusComponent } from './user/generation-status/generation-status.component';
import { ChatbotComponent } from './user/chatbot/chatbot.component';
import { ContentActivityComponent } from './admin/content-activity/content-activity.component';
import { ViewLessonPlanComponent } from './admin/view-lesson-plan/view-lesson-plan.component';
import { LandingComponent } from './landing.component';
import { RoleManagementComponent } from './admin/role-management/role-management.component';

const routes: Routes = [
  {
    path: '',
    component: ViewComponent,
    children: [
      { path: '', component: LandingComponent, pathMatch: 'full' },
      {
        path: 'home',
        component: TeacherDashboardComponent,
        data: { permissions: ['home.view'], trackingTag: 'home' },
        canActivate: [PermissionGuard, IsProfileCompleteGuard, BaselineSurveyGuard, EndlineSurveyGuard],
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/leaders-dashboard/leaders-dashboard.component').then((component) => component.LeadersDashboardComponent),
        data: { permissions: ['analytics.view'] },
        canActivate: [PermissionGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { permissions: ['profile.view'], trackingTag: 'profile' },
        canActivate: [PermissionGuard, EndlineSurveyGuard],
      },
      {
        path: 'content-generation',
        loadChildren: () => import('./user/content-generation/content-generation.module').then((module) => module.ContentGenerationModule),
        data: { permissions: ['content.view'] },
        canActivate: [PermissionGuard, IsProfileCompleteGuard, BaselineSurveyGuard, EndlineSurveyGuard],
      },
      {
        path: 'generation-status',
        component: GenerationStatusComponent,
        data: { permissions: ['generation.status.view'], trackingTag: 'generation-status' },
        canActivate: [PermissionGuard, IsProfileCompleteGuard, BaselineSurveyGuard, EndlineSurveyGuard],
      },
      {
        path: 'chat',
        component: ChatbotComponent,
        data: { permissions: ['chat.use'], type: 'general', trackingTag: 'chatbot' },
        canActivate: [PermissionGuard, IsProfileCompleteGuard, BaselineSurveyGuard, EndlineSurveyGuard],
      },
      {
        path: 'question-papers',
        loadChildren: () => import('./user/question-bank/question-bank.module').then((module) => module.QuestionBankModule),
        data: { permissions: ['question-paper.generate'] },
        canActivate: [PermissionGuard, IsProfileCompleteGuard, BaselineSurveyGuard, EndlineSurveyGuard],
      },
      {
        path: 'schedule',
        loadChildren: () => import('./user/schedule/schedule.module').then((module) => module.ScheduleModule),
        data: { permissions: ['schedule.view'] },
        canActivate: [PermissionGuard, IsProfileCompleteGuard, BaselineSurveyGuard, EndlineSurveyGuard],
      },
      {
        path: 'schools',
        loadChildren: () => import('./admin/school-management/school-management.module').then((module) => module.SchoolManagementModule),
        data: { permissions: ['school.list'] },
        canActivate: [PermissionGuard],
      },
      {
        path: 'teachers',
        loadChildren: () => import('./admin/user-management/user-management.module').then((module) => module.UserManagementModule),
        data: { permissions: ['user.view'] },
        canActivate: [PermissionGuard],
      },
      {
        path: 'staff',
        loadChildren: () => import('./admin/shikshan-user-management/shikshan-user-management.module').then((module) => module.ShikshanUserManagementModule),
        data: { permissions: ['user.view'] },
        canActivate: [PermissionGuard],
      },
      {
        path: 'roles',
        component: RoleManagementComponent,
        data: { permissions: ['role.view'] },
        canActivate: [PermissionGuard],
      },
      {
        path: 'content-activity',
        component: ContentActivityComponent,
        data: { permissions: ['content.activity.view'], idleTracking: 'custom' },
        canActivate: [PermissionGuard],
      },
      {
        path: 'content-activity/lesson-plan/:id',
        component: ViewLessonPlanComponent,
        data: { permissions: ['content.activity.view'] },
        canActivate: [PermissionGuard],
      },
      {
        path: 'training',
        loadChildren: () => import('./admin/teacher-training/teacher-training.module').then((module) => module.TeacherTrainingModule),
        data: { permissions: ['training.view'] },
        canActivate: [PermissionGuard],
      },
      {
        path: 'audit-log',
        loadComponent: () => import('./admin/audit-log/audit-log.component').then((component) => component.AuditLogComponent),
        data: { permissions: ['audit.view'], idleTracking: 'custom' },
        canActivate: [PermissionGuard],
      },
      {
        path: 'help',
        loadComponent: () => import('./user/help/help.component').then((component) => component.HelpComponent),
        data: { permissions: ['help.view'], trackingTag: 'help' },
        canActivate: [PermissionGuard, EndlineSurveyGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewRoutingModule {}
