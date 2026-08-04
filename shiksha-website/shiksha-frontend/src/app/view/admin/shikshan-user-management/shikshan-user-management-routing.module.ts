import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserStaffListComponent } from 'src/app/shared/components/user-staff-list/user-staff-list.component';
import { PermissionGuard } from 'src/app/core/guards/permission.guard';
import { UserManageComponent } from 'src/app/shared/components/user-manage/user-manage.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch:'full'
  },
  {
    path: 'list',
    component:UserStaffListComponent,
    data:{
      idleTracking:'custom',
    }
  },
  {
    path: 'add',
    component:UserManageComponent,
    data:{ permissions: ['user.create'], teacherForm: false, idleTracking:'custom' },
    canActivate: [PermissionGuard],
  },
  {
    path: ':id',
    component:UserManageComponent,
    data:{ permissions: ['user.view'], teacherForm: false, idleTracking:'custom' },
    canActivate: [PermissionGuard],
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShikshanUserManagementRoutingModule { }
