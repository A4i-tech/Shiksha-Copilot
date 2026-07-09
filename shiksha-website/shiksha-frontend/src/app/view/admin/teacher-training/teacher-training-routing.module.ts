import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBatchComponent } from './create-batch/create-batch.component';
import { ViewBatchComponent } from './view-batch/view-batch.component';
import { ViewAssignedTeachersComponent } from './view-assigned-teachers/view-assigned-teachers.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'view-batch',
    pathMatch: 'full'
  },
  {
    path: 'create-batch',
    component: CreateBatchComponent,
    data:{
      idleTracking:'custom',
    }
  },
  {
    path: 'view-batch',
    component: ViewBatchComponent,
    data:{
      idleTracking:'custom',
    }
  },
  {
    path: 'view-teachers/:batchId',
    component: ViewAssignedTeachersComponent,
    data:{
      idleTracking:'custom',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherTrainingRoutingModule { } 