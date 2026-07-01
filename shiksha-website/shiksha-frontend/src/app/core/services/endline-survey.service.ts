import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class EndlineSurveyService {
  private readonly url = `${environment.apiUrl}/endline-surveys`;
  constructor(private http: HttpClient) {}
  checkStatus() { return this.http.get<any>(`${this.url}/check`); }
  submitSurvey(data: any) { return this.http.post<any>(this.url, data); }
}
