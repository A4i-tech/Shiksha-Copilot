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
      permissions: ['lesson-resource.generate'],
      trackingTag:'lesson-resources',
      idleTracking:'custom',
    },
    canActivate: [PermissionGuard],
  },
  {
    path:'lesson-plan',
    component:LessonPlanResourceDetailsComponent,
    data:{
      permissions: ['lesson-plan.generate'],
      trackingTag:'lesson-plan-list',
      idleTracking:'custom',
    },
    canActivate: [PermissionGuard],
  },
  {
    path:'presentation',
    component:PresentationGenerationComponent,
    data:{
      permissions: ['presentation.generate.arbitrary'],
      mode:'generate',
      trackingTag:'presentation',
      idleTracking:'skip',
    },
    canActivate: [PermissionGuard],
  },
  {
    path:'presentation/:id',
    component:PresentationGenerationComponent,
    data:{
      permissions: ['presentation.generate.arbitrary', 'presentation.generate.lesson-plan'],
      trackingTag:'view-presentation',
    },
    canActivate: [PermissionGuard],
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
      permissions: ['chat.use'],
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
