import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface Teacher {
  _id: string;
  identity: { name: string; phone: string };
  school: { state: string; zone: string; district: string; block: string };
  attendance: string[];
}

export interface Batch {
  _id?: string; // Add _id as it comes from MongoDB
  batchName: string;
  description: string;
  scheduleDate: string;
  trainingType: string;
  assignedTeachers?: Teacher[]; // Array to store assigned teachers
  attendance?: string[]; // Array to store IDs of teachers marked as present
  isSubmitted?: boolean; // New field to indicate if the batch has been submitted
  pdfPath?: string;
  photoPaths?: { path: string; mimetype: string }[];
  attendancePdfPath?: string;
  createdBy?: { identity: { name: string } };
}

export interface TeacherStats {
  totalTeachers: number;
  trainedTeachers: number;
  untrainedTeachers: number;
}

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  baseUrl:any;
  private batchesSubject = new BehaviorSubject<Batch[]>([]);
  batches$ = this.batchesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  addBatch(batchData: FormData | Batch): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/teacher-training-batches`, batchData);
  }

  fetchBatches(): Observable<Batch[]> {
    return this.http.get<Batch[]>(`${this.baseUrl}/teacher-training-batches`);
  }

  getAvailableTeachers(page: number, limit: number, search: string): Observable<{ success: boolean; data: { results: Teacher[]; totalItems: number } }> {
    const params = new HttpParams().set('page', page).set('limit', limit).set('search', search);
    return this.http.get<{ success: boolean; data: { results: Teacher[]; totalItems: number } }>(`${this.baseUrl}/teacher-training-batches/available-teachers`, { params });
  }

  assignTeacherToBatch(batchId: string, teacherId: string): Observable<Batch> {
    return this.http.post<Batch>(`${`${this.baseUrl}/teacher-training-batches`}/${batchId}/assign-teacher`, { teacherId });
  }

  removeTeacherFromBatch(batchId: string, teacherId: string): Observable<Batch> {
    return this.http.post<Batch>(`${`${this.baseUrl}/teacher-training-batches`}/${batchId}/remove-teacher`, { teacherId });
  }

  setBatches(batches: Batch[]): void {
    this.batchesSubject.next(batches);
  }

  deleteBatch(batchId: string): Observable<void> {
    return this.http.delete<void>(`${`${this.baseUrl}/teacher-training-batches`}/${batchId}`);
  }

  updateAttendance(batchId: string, attendance: string[]): Observable<Batch> {
    return this.http.put<Batch>(`${`${this.baseUrl}/teacher-training-batches`}/${batchId}/attendance`, { attendance });
  }

  submitBatch(batchId: string): Observable<Batch> {
    return this.http.put<Batch>(`${`${this.baseUrl}/teacher-training-batches`}/${batchId}/submit`, {});
  }

  getBatchById(batchId: string): Observable<Batch> {
    return this.http.get<Batch>(`${this.baseUrl}/teacher-training-batches/${batchId}`);
  }

  // New method to fetch a file as a Blob
  getFile(path: string): Observable<Blob> {
    // Assuming the path starts with 'uploads/' and needs to be relative to the base URL
    const fullUrl = `/${path}`;
    return this.http.get(fullUrl, { responseType: 'blob' });
  }

extractActualFilename(url:any) {
  try {
    const parsedUrl = new URL(url);
    const segments = parsedUrl.pathname.split("/");
    const fullFilename = segments[segments.length - 1];

    if (!fullFilename) return null; // No filename found

    if (!fullFilename.includes("_")) return fullFilename;

    return fullFilename.split("_").slice(1).join("_");
  } catch (err) {
    console.error("Invalid URL:", err);
    return null;
  }
}



  updateBatchInList(updatedBatch: Batch): void {
    const currentBatches = this.batchesSubject.getValue();
    const index = currentBatches.findIndex(batch => batch._id === updatedBatch._id);
    if (index !== -1) {
      currentBatches[index] = updatedBatch;
      this.batchesSubject.next([...currentBatches]);
    }
  }

  uploadBatchFiles(batchId: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/teacher-training-batches/${batchId}/upload-pdf`, formData);
  }

  getTeacherTrainingStats(): Observable<TeacherStats> {
    return this.http.get<TeacherStats>(`${this.baseUrl}/teacher-training-batches/stats`);
  }

  // Download the batch Excel report from the backend
  downloadBatchExcelReport(batchId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/teacher-training-batches/${batchId}/export-report`, {
      responseType: 'blob'
    });
  }
}
