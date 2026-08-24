import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/core/guards/permission.guard';
import { ContentActivityComponent } from './content-activity/content-activity.component';
import { ViewLessonPlanComponent } from './view-lesson-plan/view-lesson-plan.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'leaders-dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    data: {
      permissions: ['admin','manager'],
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'school-management',
    loadChildren: () =>
      import('./school-management/school-management.module').then(
        (m) => m.SchoolManagementModule
      ),
    data: {
      permissions: ['admin','manager'],
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'user-management',
    loadChildren: () =>
      import('./user-management/user-management.module').then(
        (m) => m.UserManagementModule
      ),
    data: {
      permissions: ['admin','manager'],
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'shikshana-user',
    loadChildren: () =>
      import('./shikshan-user-management/shikshan-user-management.module').then(
        (m) => m.ShikshanUserManagementModule
      ),
    data: {
      permissions: ['admin'],
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'content-activity',
    component:ContentActivityComponent,
    data: {
      permissions: ['admin','manager'],
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'content-activity/lesson-plan/:id',
    component:ViewLessonPlanComponent,
    data: {
      permissions: ['admin','manager'],
    },
    canActivate: [PermissionGuard],
  },
  {
    path:'audit-log',
    loadComponent:()=> import('./audit-log/audit-log.component').then((c)=>c.AuditLogComponent),
    data: {
      permissions: ['admin','manager'],
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'leaders-dashboard',
    loadComponent: () =>
      import('./leaders-dashboard/leaders-dashboard.component').then(
        (c) => c.LeadersDashboardComponent
      ),
    data: {
      permissions: ['admin', 'manager', 'hm', 'crp', 'beo', 'meo', 'deo', 'ddpi', 'state'],
    },
    canActivate: [PermissionGuard],
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
