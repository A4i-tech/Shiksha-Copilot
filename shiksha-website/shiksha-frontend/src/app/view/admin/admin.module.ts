import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownComponent } from 'src/app/shared/components/dropdown/dropdown.component';
import { ContentActivityComponent } from './content-activity/content-activity.component';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { ContentGenerationModule } from '../user/content-generation/content-generation.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ContentActivityComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DropdownComponent,
    PaginationComponent,
    ContentGenerationModule,
    RouterModule
  ]
})
export class AdminModule { }
