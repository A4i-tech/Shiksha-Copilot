import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShikshanUserManagementRoutingModule } from './shikshan-user-management-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { UserManageComponent } from 'src/app/shared/components/user-manage/user-manage.component';

@NgModule({
  imports: [
    CommonModule,
    ShikshanUserManagementRoutingModule,
    TranslateModule,
    UserManageComponent,
  ],
})
export class ShikshanUserManagementModule { }
