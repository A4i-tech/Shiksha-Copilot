import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseRestService } from 'src/app/core/services/base-rest.service';
import { LOADER_MESSAGE } from 'src/app/core/services/loader-message.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuestionBankService extends BaseRestService {
  baseUrl: string;

  /**
   * Class constructor
   * @param http HttpClient
   */
  constructor(http: HttpClient) {
    super(http);
    this.setUri('question-bank');
    this.baseUrl = environment.apiUrl;
  }

  /**
   * Function to get chapter by semester
   * @param filters
   * @returns
   */
  getChaptersBySem(filters?: { [key: string]: any }) {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          if (key === 'subject') {
            params = params.set(`filter[${key}]`, JSON.stringify(filters[key]));
          } else {
            params = params.set(`filter[${key}]`, filters[key]);
          }
        }
      });
    }

    return this.http.get(`${this.baseUrl}/chapter/get-by-sem`, { params });
  }

  /**
   * Function to get all question banks
   * @param filters
   * @param search
   * @returns
   */
  getAllQuestionBanks(filters?: { [key: string]: any }, search?: any) {
    let params = new HttpParams().set('page', '1').set('limit', '999');
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          if (key === 'semester') {
            params = params.set(`filter[${key}]`, JSON.stringify(filters[key]));
          } else if (key === 'search') {
            params = params.set('search', filters[key]);
          } else {
            params = params.set(`filter[${key}]`, filters[key]);
          }
        }
      });
    }

    return this.get('list', params);
  }

  /**
   * Function to get question bank by id
   * @param id
   * @returns
   */
  getQuestionBankDetails(id: any) {
    return this.get(id);
  }

  /**
   * Function to generate question bank template
   * @param data
   * @returns
   */
  generateQuestionBankTemplate(data: any): Observable<any> {
    return this.post('generate-template', data);
  }

  /**
   * Function to generate question bank blue print
   * @param data
   * @returns
   */
  generateQuestionBankBluePrint(data: any): Observable<any> {
    return this.http.post(`${this.getUrl()}generate-blue-print`, data, {
      context: new HttpContext().set(LOADER_MESSAGE, 'Generating blueprint...')
    });
  }

  /**
   * Function to generate question bank
   * @param data
   * @returns
   */
  generateQuestionBank(data: any) {
    return this.http.post(`${this.getUrl()}generate`, data, {
      context: new HttpContext().set(LOADER_MESSAGE, data?.isPreview ? 'Generating questions...' : 'Creating question paper...')
    });
  }

  /**
   * Function to update question bank feedback
   * @param id
   * @param data
   * @returns
   */
  updateQuestionBankFeedback(id: any, data: any) {
    return this.patch(`feedback/${id}`, data);
  }

  // LBA Question Paper Generation Methods

  /**
   * Function to get classes for LBA QP
   * @returns Observable<string[]>
   */
  getClasses(): Observable<string[]> {
    return this.http.get<any>(`${this.baseUrl}/question-bank/meta/classes`).pipe(
      // unwrap formatted response if present
      (source => new Observable<string[]>(observer => source.subscribe({
        next: (resp) => observer.next(Array.isArray(resp) ? resp : (resp?.data ?? [])),
        error: (e) => observer.error(e),
        complete: () => observer.complete()
      })))
    );
  }

  /**
   * Function to get media for LBA QP
   * @param filters
   * @returns Observable<string[]>
   */
  getMedia(filters: { class: string }): Observable<string[]> {
    let params = new HttpParams();
    if (filters.class) {
      params = params.set('class', filters.class);
    }
    return this.http.get<any>(`${this.baseUrl}/question-bank/meta/media`, { params }).pipe(
      (source => new Observable<string[]>(observer => source.subscribe({
        next: (resp) => observer.next(Array.isArray(resp) ? resp : (resp?.data ?? [])),
        error: (e) => observer.error(e),
        complete: () => observer.complete()
      })))
    );
  }
  updateQuestionPaper(id: string, data: any): Observable<any> {
    // Use PUT or PATCH so the backend knows to update the existing record
    return this.http.put(`${this.baseUrl}/question-bank/${id}`, data);
  }

  /**
   * Function to get chapters for LBA QP
   * @param filters
   * @returns Observable<any[]>
   */
  getChapters(filters: { class: string; medium: string; subject: string }): Observable<any[]> {
    let params = new HttpParams();
    if (filters.class) {
      params = params.set('class', filters.class);
    }
    if (filters.medium) {
      params = params.set('medium', filters.medium);
    }
    if (filters.subject) {
      params = params.set('subject', filters.subject);
    }
    return this.http.get<any>(`${this.baseUrl}/question-bank/meta/chapters`, { params }).pipe(
      (source => new Observable<any[]>(observer => source.subscribe({
        next: (resp) => observer.next(Array.isArray(resp) ? resp : (resp?.data ?? [])),
        error: (e) => observer.error(e),
        complete: () => observer.complete()
      })))
    );
  }

  /**
   * Function to get difficulties for LBA QP
   * @returns Observable<string[]>
   */
  getDifficulties(): Observable<string[]> {
    return this.http.get<any>(`${this.baseUrl}/question-bank/meta/difficulties`).pipe(
      (source => new Observable<string[]>(observer => source.subscribe({
        next: (resp) => observer.next(Array.isArray(resp) ? resp : (resp?.data ?? [])),
        error: (e) => observer.error(e),
        complete: () => observer.complete()
      })))
    );
  }

  /**
   * Function to get answer types for LBA QP
   * @returns Observable<string[]>
   */
  getAnswerTypes(): Observable<string[]> {
    return this.http.get<any>(`${this.baseUrl}/question-bank/meta/answerTypes`).pipe(
      (source => new Observable<string[]>(observer => source.subscribe({
        next: (resp) => observer.next(Array.isArray(resp) ? resp : (resp?.data ?? [])),
        error: (e) => observer.error(e),
        complete: () => observer.complete()
      })))
    );
  }

  /**
   * Function to get questions for LBA QP
   * @param filters
   * @returns Observable<any[]>
   */
  getLBAQuestions(filters: {
    subject: string;
    medium: string;
    class: string;
    chapterNumbers: string;
    chapterIds?: string;
    marks?: string;
    difficulty?: string;
    type?: string;
    search?: string;
    headings?: string;
    targetLanguage?: string;
  }): Observable<any[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<any>(`${this.baseUrl}/question-bank/questions`, { params }).pipe(
      (source => new Observable<any[]>(observer => source.subscribe({
        next: (resp) => observer.next(Array.isArray(resp) ? resp : (resp?.data ?? [])),
        error: (e) => observer.error(e),
        complete: () => observer.complete()
      })))
    );
  }

  /**
   * Function to generate LBA question paper
   * @param data
   * @returns Observable<any>
   */
  generateLBAQuestionPaper(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/question-bank/generate`, data, {
      context: new HttpContext().set(LOADER_MESSAGE, 'Creating question paper...')
    });
  }
}
