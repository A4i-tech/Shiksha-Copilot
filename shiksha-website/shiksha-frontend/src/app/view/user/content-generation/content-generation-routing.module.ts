import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonContentListComponent } from './lesson-content-list/lesson-content-list.component';
import { LessonPlanResourceDetailsComponent } from 'src/app/shared/components/lesson-plan-resource-details/lesson-plan-resource-details.component';
import { DraftGuard } from 'src/app/core/guards/draft.guard';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { PermissionGuard } from 'src/app/core/guards/permission.guard';
import { LessonPlanViewEditComponent } from './lesson-plan-view-edit/lesson-plan-view-edit.component';
import { PresentationGenerationComponent } from './presentation-generation/presentation-generation.component';

const routes: Routes = [
  {
    path:'',
    component:LessonContentListComponent,
    data:{
      trackingTag:'content-generation-list',
      idleTracking:'custom',
    }
  },
  {
    path:'lesson-resources',
    component:LessonPlanResourceDetailsComponent,
    data:{
      trackingTag:'lesson-resources',
      idleTracking:'custom',
    }
  },
  {
    path:'lesson-plan',
    component:LessonPlanResourceDetailsComponent,
    data:{
      trackingTag:'lesson-plan-list',
      idleTracking:'custom',
    }
  },
  {
    path:'presentation',
    component:PresentationGenerationComponent,
    data:{
      mode:'generate',
      trackingTag:'presentation',
      idleTracking:'skip',
    }
  },
  {
    path:'presentation/:id',
    component:PresentationGenerationComponent,
    data:{
      trackingTag:'view-presentation',
    }
  },
  {
    path:'inspect/:planType',
    component:LessonPlanViewEditComponent,
    canDeactivate:[DraftGuard],
    data:{
      mode:'generate',
      trackingTag:'generate-content',
      idleTracking:'skip',
    }
  },
  {
    path:':planType/:id',
    component:LessonPlanViewEditComponent,
    canDeactivate:[DraftGuard],
    data:{
      mode:'view',
      trackingTag:'view-content',
      trackingTagMap:{'lesson-plan':'view-lp','resource-plan':'view-lr'},
    }
  },
  {
    path:':planType/draft/:id',
    component:LessonPlanViewEditComponent,
    canDeactivate:[DraftGuard],
    data:{
      mode:'draft',
      trackingTag:'draft-content',
    }
  },
  {
    path:'lesson-chat',
    component:ChatbotComponent,
    data:{
      type:'index',
      permissions: ['power'],
      trackingTag:'lesson-chat',
    },
    canActivate: [PermissionGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentGenerationRoutingModule { }
