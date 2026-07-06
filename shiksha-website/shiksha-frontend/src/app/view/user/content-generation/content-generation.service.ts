import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRestService } from 'src/app/core/services/base-rest.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContentGenerationService extends BaseRestService {
  baseUrl = environment.apiUrl;
  formfiltervalues: any;
  // impact multiple lesson plan - choose lesson plan
  // lessonPlanData: any;
  selectedLessonPlan: any;
  viewLesson: any;
  viewResource: any;
  viewResFormvalues: any;
  resourcePlanData: any;

  showDraftConfirmation=false;

  constructor(http: HttpClient) {
    super(http);
    this.setUri('teacher-lesson-plan');
  }

  getAllList(paramVals: any): Observable<any> {
    let params = new HttpParams()
      .set('page', '1')
      .set('limit', '999');
    if (paramVals.selectedType) {
      params = params.set('filter[type]', paramVals.selectedType);
    }

    if (paramVals.selectedBoard) {
      params = params.set('filter[board]', paramVals.selectedBoard);
    }

    if (paramVals.selectedMedium) {
      params = params.set('filter[medium]', paramVals.selectedMedium);
    }

    if (paramVals.selectedClass) {
      params = params.set('filter[class]', paramVals.selectedClass);
    }

    if (paramVals.selectedSubject) {
      params = params.set('filter[subject]', paramVals.selectedSubject);
    }

    if (paramVals.searchTerm) {
      params = params.set('search', paramVals.searchTerm);
    }

    if (paramVals.selectedMonth) {
      params = params.set('filter[createdMonth]', paramVals.selectedMonth);
    }

    if (paramVals.isCompleted) {
      params = params.set('filter[isCompleted]', paramVals.isCompleted);
    }

    if (paramVals.isGenerated) {
        params = params.set('filter[isGenerated]', paramVals.isGenerated);
      }

    const options = {
      params: params,
    };
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/list`, options);
  }

  getMedium(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/me`);
  }

  getFromMasterClass(medium: string): Observable<any> {
    let params = new HttpParams();

    if (medium) {
      params = params.set('filter[medium]', medium);
    }
    return this.http.get(
      `${this.baseUrl}/master-class/list?limit=999&sortBy=standard&sortOrder=asc`,
      { params }
    );
  }

  getSubjects(boardAbbr: any) {
    return this.http.get(
      `${this.baseUrl}/master-subject/get-by-board/${boardAbbr}`
    );
  }

  getTemplates(params:HttpParams) {
    const options = {
      params: params,
    };
    return this.http.get(`${this.baseUrl}/lesson-plan-template/list`, options);
  }

  getLessonPlan(formValue: any): Observable<any> {
    let params = new HttpParams();

    if (formValue.medium) {
      params = params.set('filter[medium]', formValue.medium);
    }

    if (formValue.board) {
      params = params.set('filter[board]', formValue.board);
    }

    if (formValue.class) {
      params = params.set('filter[class]', formValue.class);
    }

    if (formValue.subject) {
      params = params.set('filter[subject]', formValue.subject);
    }

    if (formValue.semester) {
      params = params.set('filter[semester]', formValue.semester);
    }

    if (formValue.topics) {
      params = params.set('filter[topics]', formValue.topics);
    }

    if (formValue.subtopics) {
      params = params.set(
        'filter[subTopics]',
        JSON.stringify(formValue.subtopics)
      );
    }

    if (formValue.level) {
      params = params.set('filter[level]', formValue.level);
    }

    if (formValue.model) {
      params = params.set('filter[teachingModel]', formValue.model);
    }

    if (formValue.videos) {
      params = params.set('filter[includeVideos]', formValue.videos);
    }

    const options = {
      params: params,
    };
    return this.http.get(`${this.baseUrl}/master-lesson/list`, options);
  }

  modifyContent(data: any) {
    return this.http.post(`${this.baseUrl}/lesson-plan/save-to-teacher`, data);
  }

  saveLessonPlan(data:any) {
    return this.http.post(`${this.baseUrl}/lesson-plan/save-to-teacher`, data);
  }

  getResourcePlan(formvalues: any): Observable<any> {
    let params = new HttpParams();

    if (formvalues.medium) {
      params = params.set('filter[medium]', formvalues.medium);
    }

    if (formvalues.board) {
      params = params.set('filter[board]', formvalues.board);
    }

    if (formvalues.class) {
      params = params.set('filter[class]', formvalues.class);
    }

    if (formvalues.subject) {
      params = params.set('filter[subject]', formvalues.subject);
    }

    if (formvalues.topics) {
      params = params.set('filter[topics]', formvalues.topics);
    }

    if (formvalues.subtopics) {
      params = params.set('filter[subTopics]', formvalues.subtopics);
    }

    const options = {
      params: params,
    };
    return this.http.get(`${this.baseUrl}/resource-plan/list`, options);
  }

  saveResourcePlan(data:any) {
    return this.http.post(`${this.baseUrl}/lesson-plan/save-to-teacher`, data);
  }

  createFeedback(data: any) {
    return this.http.post(`${this.baseUrl}/lesson-feedback/create`, data);
  }
  createResourceFeedback(data: any) {
    return this.http.post(
      `${this.baseUrl}/teacher-resource-feedback/create`,
      data
    );
  }

  getBoardsList() {
    return this.http.get(`${this.baseUrl}/board/list?limit=99`);
  }

  getTopicsSubtopics(
    board?: string,
    medium?: string,
    standard?: string,
    subject?: any
  ) {
    let params = new HttpParams();

    if (board) {
      params = params.set('filter[board]', board);
    }
    if (subject) {
      params = params.set('filter[subject]', subject);
    }
    if (medium) {
      params = params.set('filter[medium]', medium);
    }
    if (standard) {
      params = params.set('filter[standard]', standard);
    }
    params=params.set('limit','999')
    params=params.set('sortBy','orderNumber')
    params=params.set('sortOrder','asc')
    return this.http.get(`${this.baseUrl}/chapter/list`, { params });
  }

  lessonPlanExists(lessonPlanId: any) {
    return this.http.get(
      `${this.baseUrl}/teacher-lesson-plan/exists/${lessonPlanId}`
    );
  }

  getSubtopics(body:any, type: any) {
    if (type === 'lesson') {
      return this.http.post(`${this.baseUrl}/master-lesson/learning-outcomes`,body);
    } else {
      return this.http.post(`${this.baseUrl}/resource-plan/learning-outcomes`,body);
    }
  }

  getLessonPlanDetails(planId: any, params: any) {
    return this.http.get(`${this.baseUrl}/master-lesson/${planId}`, { params });
  }

  getResourcePlanDetails(planId: any, params: any) {
    return this.http.get(`${this.baseUrl}/master-resource/${planId}`, { params });
  }

  getLessonPlanById(id:any){
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/lesson/${id}`);
  }

  getLessonPlanPresentation(lessonPlanId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/presentation/${lessonPlanId}`);
  }

  generateLessonPlanPresentation(lessonPlanId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/teacher-lesson-plan/presentation/${lessonPlanId}`, {});
  }

  getResourcePlanById(id:any){
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/resource/${id}`);
  }

  getRegenerationLimit(){
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/regeneration-limit`);
  }

  generateNewContent(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/teacher-lesson-plan/generate`,data)
  }

  regenerateContent(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/teacher-lesson-plan/regenerate`,data)
  }

  retry(data:any):Observable<any>{
   return this.http.post(`${this.baseUrl}/teacher-lesson-plan/retry`,data)
  }

  sectionAiEdit(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/teacher-lesson-plan/section-ai-edit`,data)
  }

  planAiEdit(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/teacher-lesson-plan/plan-ai-edit`,data)
  }

  downloadLPDetails(lessonId:any):Observable<any>{
    return this.http.get(`${this.baseUrl}/master-lesson/lesson/tables/${lessonId}`)
  }

  createPresentationJob(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/presentation/job`, formData);
  }

  getPresentationJob(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get(`${this.baseUrl}/presentation/job`, { params });
  }

  deletePresentationJob(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.delete(`${this.baseUrl}/presentation/job`, { params });
  }

  retryPresentationJob(id: string): Observable<boolean> {
    const params = new HttpParams().set('id', id);
    return this.http.get<boolean>(`${this.baseUrl}/presentation/job/retry`, { params });
  }

  getPresentationJobs(paramVals: any): Observable<any> {
    let params = new HttpParams()
      .set('offset', '0')
      .set('limit', '100');

    if (paramVals.presentationMonth) {
      const [year, month] = paramVals.presentationMonth.split('-').map(Number);
      const createdAfter = new Date(year, month - 1, 1).toISOString();
      const createdBefore = new Date(year, month, 0, 23, 59, 59, 999).toISOString();
      params = params
        .set('created_after', createdAfter)
        .set('created_before', createdBefore);
    }

    if (paramVals.presentationStatus === 'complete') {
      params = params.set('status', 'complete');
    }

    return this.http.get(`${this.baseUrl}/presentation/jobs`, { params });
  }

  getPresentationTools(): Observable<any> {
    return this.http.get(`${this.baseUrl}/presentation/tools`);
  }

  async openPresentationEventStream(
    jobId: string,
    onMessage: (event: MessageEvent<string>) => void,
    onError: () => void
  ) {
    const res = await fetch(`${environment.apiUrl}/presentation/events/token?jobId=${jobId}`, {method: "POST", headers: {"Authorization": localStorage.getItem('token') || ""}});
    const token = await res.text();
    const eventSource = new EventSource(`${this.baseUrl}/presentation/events/${token}`);
    eventSource.onmessage = onMessage;
    eventSource.onerror = onError;
    return eventSource;
  }

  closePresentationEventStream(eventSource: EventSource | null | undefined): null {
    if (eventSource) {
      eventSource.close();
    }
    return null;
  }

  getPresentationStatusLabel(status?: string): string {
    if (status === 'complete') return 'Complete';
    if (status === 'error') return 'Failed';
    if (status === 'idle') return 'Queued';
    return 'In Progress';
  }

  downloadPresentationFile(jobId: string, fileFormat: 'pptx' | 'pdf'): Observable<Blob> {
    const params = new HttpParams().set('file_format', fileFormat);
    return this.http.get(`${this.baseUrl}/presentation/job/${jobId}`, {
      params,
      responseType: 'blob',
    });
  }

  headPresentationFile(jobId: string) {
    return this.http.head(`${this.baseUrl}/presentation/job/${jobId}`, {
      params: new HttpParams().set('file_format', 'pptx'),
      observe: 'response',
    });
  }
}
