import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileComponent } from './profile/profile.component';
import { DropdownComponent } from 'src/app/shared/components/dropdown/dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageSwitcherComponent } from 'src/app/shared/components/language-switcher/language-switcher.component';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgChartsModule } from 'ng2-charts';
import { DeleteDetailComponent } from 'src/app/shared/components/delete-detail/delete-detail.component';
import { ProfileImageComponent } from 'src/app/shared/components/profile-image/profile-image.component';
import { GenerationStatusComponent } from './generation-status/generation-status.component';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ProfileComponent,
    DashboardComponent,
    GenerationStatusComponent
  ],
  imports: [
    CommonModule,
    DropdownComponent,
    ReactiveFormsModule,
    FormsModule,
    LanguageSwitcherComponent,
    TranslateModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgChartsModule,
    DeleteDetailComponent,
    ProfileImageComponent,
    PaginationComponent,
    RouterModule,
  ]
})
export class UserModule { }
