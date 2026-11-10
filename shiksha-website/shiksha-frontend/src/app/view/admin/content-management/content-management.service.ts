import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { BaseRestService } from 'src/app/core/services/base-rest.service';
import { environment } from 'src/environments/environment';
import { LIST_TAB_BY_STATUS } from './content-status.constants';

export interface Curator {
  _id: string;
  name: string;
}

export interface CurationChapter {
  _id: string;
  topics: string;
  orderNumber: number;
  status: string;
  standard: number;
  medium: string;
  board: string;
  subject: { subjectName: string }[];
  subTopics: string[];
  reviewComment?: { text: string };
}

export interface ContentListQuery {
  page: number;
  limit: number;
  search?: string;
  /** '0' returns the active records, '2' returns the deleted records */
  includeDeleted?: string;
  filters?: { [key: string]: any };
}

/**
 * Client of the admin content-management routes. Every route sits under
 * `/api/admin/content/` and needs the admin role.
 */
@Injectable({
  providedIn: 'root',
})
export class ContentManagementService extends BaseRestService {
  curators: Curator[] = [];

  /**
   * class constructor
   * @param http
   */
  constructor(http: HttpClient) {
    super(http);
    this.setUri('admin/content');
  }

  /**
   * Method to read one page of records of an entity
   * @param segment route segment of the entity
   * @param query page, search and filter values
   * @returns
   */
  list(segment: string, query: ContentListQuery, curatorMode = false): Observable<any> {
    return this.http.get(`${this.url(curatorMode)}${segment}`, { params: this.listParams(query) });
  }

  private url(curatorMode: boolean): string {
    return curatorMode ? `${environment.apiUrl}/curator/content/` : this.getUrl();
  }

  listByStatus(segment: string, status: string, filters?: { [key: string]: any }): Observable<any> {
    return this.list(segment, { page: 1, limit: 999, includeDeleted: LIST_TAB_BY_STATUS[status], filters }, true);
  }

  // Chapter status picks the list tab, so read the chapter first.
  loadCuratorChapter(
    chapterId: string,
    children: { segment: string; filters: { [key: string]: any } }[]
  ): Observable<{ chapter?: CurationChapter; lists: any[][] }> {
    return this.list('chapters', { page: 1, limit: 1, filters: { _id: chapterId, isDeleted: 'true' } }, true).pipe(
      switchMap((res) => {
        const chapter: CurationChapter | undefined = res.data.results[0];
        if (!chapter || !children.length) return of({ chapter, lists: [] });

        return forkJoin(
          children.map((child) => this.listByStatus(child.segment, chapter.status, child.filters))
        ).pipe(map((responses) => ({ chapter, lists: responses.map((response) => response.data.results) })));
      })
    );
  }

  private listParams(query: ContentListQuery): HttpParams {
    let params = new HttpParams()
      .set('page', query.page.toString())
      .set('limit', query.limit.toString());

    if (query.search) {
      params = params.set('search', query.search);
    }

    if (query.includeDeleted) {
      params = params.set('includeDeleted', query.includeDeleted);
    }

    if (query.filters) {
      Object.keys(query.filters).forEach((key) => {
        const value = query.filters?.[key];
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(`filter[${key}]`, value);
        }
      });
    }

    return params;
  }

  exportCsv(query: ContentListQuery): Observable<Blob> {
    return this.http.get(`${this.getUrl()}chapters/export`, {
      params: this.listParams(query),
      responseType: 'blob',
    });
  }

  listCurators(): Observable<Curator[]> {
    return this.get<{ data: { results: Curator[] } }>('curators').pipe(
      map((res) => res.data.results),
      tap((curators) => (this.curators = curators))
    );
  }

  curatorName(id: string): string {
    return this.curators.find((curator) => curator._id === id)?.name ?? id;
  }

  listSubjects(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/master-subject/list`, {
      params: new HttpParams().set('includeDeleted', '0'),
    });
  }

  /**
   * Method to read one record
   * @param segment route segment of the entity
   * @param id record id
   * @returns
   */
  getById(segment: string, id: string): Observable<any> {
    return this.get(`${segment}/${id}`);
  }

  /**
   * Method to add one record
   * @param segment route segment of the entity
   * @param body all fields of the new record
   * @returns
   */
  create(segment: string, body: any, curatorMode = false): Observable<any> {
    return this.http.post(`${this.url(curatorMode)}${segment}`, body);
  }

  /**
   * Method to send a file of records to the upload route of an entity
   * @param segment route segment of the entity
   * @param rows rows of the file
   * @param dryRun true validates the rows and saves nothing
   * @returns
   */
  bulkUpload(segment: string, rows: any[], dryRun: boolean): Observable<any> {
    return this.post(`${segment}/bulk-upload`, { rows, dryRun });
  }

  /**
   * Method to save the edited fields of one record
   * @param segment route segment of the entity
   * @param id record id
   * @param body changed fields only
   * @returns
   */
  update(segment: string, id: string, body: any, curatorMode = false): Observable<any> {
    return this.http.put(`${this.url(curatorMode)}${segment}/${id}`, body);
  }

  /**
   * Method to restore one soft-deleted record
   * @param segment route segment of the entity
   * @param id record id
   * @returns
   */
  restore(segment: string, id: string): Observable<any> {
    return this.patch(`${segment}/${id}/restore`, {});
  }

  /**
   * Method to approve one ready-for-review record, in a single atomic step
   * @param segment route segment of the entity
   * @param id record id
   * @returns
   */
  approve(segment: string, id: string): Observable<any> {
    return this.post(`${segment}/${id}/approve`, {});
  }

  assign(id: string, curatorId: string): Observable<any> {
    return this.post(`chapters/${id}/assign`, { curatorId });
  }

  unassign(id: string): Observable<any> {
    return this.post(`chapters/${id}/unassign`, {});
  }

  requestChanges(id: string, comment: string): Observable<any> {
    return this.post(`chapters/${id}/request-changes`, { comment });
  }

  submit(id: string): Observable<any> {
    return this.http.post(`${this.url(true)}chapters/${id}/submit`, {});
  }
}
