import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShikshanUserManagementRoutingModule } from './shikshan-user-management-routing.module';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { DisablePopupComponent } from 'src/app/shared/components/disable-popup/disable-popup.component';
import { DropdownComponent } from 'src/app/shared/components/dropdown/dropdown.component';
import { ShikshanUserManageComponent } from './shikshan-user-manage/shikshan-user-manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgToggleModule } from 'ng-toggle-button';
import { UploadPopupComponent } from 'src/app/shared/components/upload-popup/upload-popup.component';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';


@NgModule({
  declarations: [ 
    ShikshanUserManageComponent,

  ],
  imports: [
    CommonModule,
    ModalComponent,
    ShikshanUserManagementRoutingModule,
    DropdownComponent,
    DisablePopupComponent,
    FormsModule,
    ReactiveFormsModule,
    NgToggleModule,
    TranslateModule,
    UploadPopupComponent,
    PaginationComponent
  ],
})
export class ShikshanUserManagementModule { }
