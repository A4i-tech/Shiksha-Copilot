import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { UserManageComponent } from 'src/app/shared/components/user-manage/user-manage.component';

@NgModule({
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    TranslateModule,
    UserManageComponent,
  ]
})
export class UserManagementModule { }
