import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShikshanUserManageComponent } from './shikshan-user-manage/shikshan-user-manage.component';
import { UserStaffListComponent } from 'src/app/shared/components/user-staff-list/user-staff-list.component';
import { PermissionGuard } from 'src/app/core/guards/permission.guard';

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
    component:ShikshanUserManageComponent,
    data:{ permissions: ['staff.create'], idleTracking:'custom' },
    canActivate: [PermissionGuard],
  },
  {
    path: ':id',
    component:ShikshanUserManageComponent,
    data:{ permissions: ['staff.edit'], idleTracking:'custom' },
    canActivate: [PermissionGuard],
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShikshanUserManagementRoutingModule { }
