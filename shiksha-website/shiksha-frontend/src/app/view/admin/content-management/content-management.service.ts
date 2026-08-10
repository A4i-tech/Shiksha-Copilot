import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRestService } from 'src/app/core/services/base-rest.service';

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
  list(segment: string, query: ContentListQuery): Observable<any> {
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

    return this.get(segment, params);
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
  create(segment: string, body: any): Observable<any> {
    return this.post(segment, body);
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
  update(segment: string, id: string, body: any): Observable<any> {
    return this.put(`${segment}/${id}`, body);
  }

  /**
   * Method to soft-delete one record
   * @param segment route segment of the entity
   * @param id record id
   * @returns
   */
  softDelete(segment: string, id: string): Observable<any> {
    return this.delete(`${segment}/${id}`);
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
}
