import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ScheduleRoutingModule } from './schedule-routing.module';
import { AddEditScheduleComponent } from './add-edit-schedule/add-edit-schedule.component';
import { ScheduleViewComponent } from './schedule-view/schedule-view.component';
import { DropdownComponent } from 'src/app/shared/components/dropdown/dropdown.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TranslateModule } from '@ngx-translate/core';
import { DeleteDetailComponent } from '../../../shared/components/delete-detail/delete-detail.component';
import { CalendarAccessibilityDirective } from 'src/app/shared/directives/calendar';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  declarations: [
    AddEditScheduleComponent,
    ScheduleViewComponent
  ],
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    DropdownComponent,
    ReactiveFormsModule,
    DeleteDetailComponent,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    TranslateModule,
    CalendarAccessibilityDirective,
    A11yModule
  ],
  providers: [
    DatePipe
  ]
})
export class ScheduleModule { }
