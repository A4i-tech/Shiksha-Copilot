import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownComponent } from 'src/app/shared/components/dropdown/dropdown.component';
import { ContentActivityComponent } from './content-activity/content-activity.component';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ContentActivityComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DropdownComponent,
    PaginationComponent,
    RouterModule,
    TranslateModule
  ]
})
export class AdminModule { }
