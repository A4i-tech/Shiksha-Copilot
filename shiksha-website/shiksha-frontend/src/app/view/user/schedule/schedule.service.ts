import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseRestService } from 'src/app/core/services/base-rest.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',

})
export class ScheduleService extends BaseRestService{
  baseUrl = environment.apiUrl;

  /**
   * lesson plan selected on the Lesson Plan page's "Schedule this" button, read once and
   * cleared by ScheduleViewComponent to prefill the Add Details modal
   */
  pendingLessonPlan: any = null;

  constructor(http: HttpClient) {
    super(http);
    this.setUri('schedule');
   }

  /**
   * teacher's own lesson plans, most recently updated first, optionally narrowed by filters
   * @param filters optional board/medium/class/subject/topics to narrow the list
   */
  getRecentLessonPlans(filters: any = {}) {
    let params = new HttpParams()
      .set('filter[type]', 'lesson')
      .set('filter[isCompleted]', 'true')
      .set('sortBy', 'updatedAt')
      .set('sortOrder', 'desc')
      .set('limit', '25');
    if (filters.board) params = params.set('filter[board]', filters.board);
    if (filters.medium) params = params.set('filter[medium]', filters.medium);
    if (filters.class) params = params.set('filter[class]', filters.class);
    if (filters.subject) params = params.set('filter[subject]', filters.subject);
    if (filters.topic) params = params.set('filter[topics]', filters.topic);
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/list`, { params });
  }


  getAllSchedule(fromDate: any, toDate: any,teacherScheduleVal:boolean) {
    const params = new HttpParams()
      .set('fromDate', fromDate)
    .set('toDate',toDate)
    .set('teacherSchedule',teacherScheduleVal)
    return this.get('get-by-school', params);
   }

  
  getSchoolInfoByID() {
    return this.http.get(`${this.baseUrl}/auth/me`);
  }
  

  getAllChapter(body: any) {
    const params = new HttpParams()
      .set('filter[board]', body.board)
      .set('filter[medium]', body.medium)
    .set('filter[standard]',body.standard)
    .set('filter[subject]',body.subject)
    .set('limit',"999")
    .set('sortBy','orderNumber')
    .set('sortOrder','asc')
    return this.http.get(`${this.baseUrl}/chapter/list`, {
      params:params
    })
  }

  getAllSubTopic(body:any){
    const params = new HttpParams()
      .set('filter[board]', body.board)
      .set('filter[medium]', body.medium)
    .set('filter[class]',body.standard)
    .set('filter[subject]',body.subject)
    .set('filter[topics]',body.topic)
    .set('filter[type]',"lesson")
    .set('filter[isCompleted]',"true")
    .set('filter[isGroupedSubTopics]',"true")
    .set('page',"1")
    .set('limit',"999")
    
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/list`, {
      params:params
    })
  
  }


  getLessonPlan(body: any) {
    const params = new HttpParams()
      .set('filter[topics]', body.topics)
      .set('filter[subTopics]', body.subTopics)
      .set('filter[class]', body.class)
    .set('filter[type]','lesson')
    
    
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/list`, {
     params:params
      
      
    });
  }


  createSchedule(body:any) {
    return this.post('create', body);
  }

  deleteSchedule(scheduleId: string,timeId:string) {
    return  this.delete(`${scheduleId}/${timeId}`);
  }

  getScheduleById(id: string) {
    return this.get(id);
  }

 

  updateSchedule(body:any) {
    return this.put('update', body);
  }

}
