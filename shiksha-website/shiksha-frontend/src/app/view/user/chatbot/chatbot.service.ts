import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRestService } from 'src/app/core/services/base-rest.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService extends BaseRestService {

  baseUrl = environment.apiUrl;

  /**
   * Class constructor
   * @param http HttpClient
   */
  constructor(http: HttpClient) {
    super(http);
    this.setUri('chat');
  }

  /**
   * Function to send message
   * @param messageObj 
   * @returns 
   */
  sendGeneralMessage(messageObj: any): Observable<any> {
    const url = `${this.baseUrl}/chat/message`;
    return new Observable(observer => {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(messageObj)
      }).then(async response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('Response body is null');
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // Process multiple JSON objects in one chunk
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              observer.next(data);
            } catch (e) {
              console.error('Error parsing JSON chunk', e);
            }
          }
        }
        observer.complete();
      }).catch(err => {
        observer.error(err);
      });
    });
  }

  sendIndexMessage(messageObj: any, recordId: any, chapterId: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/lessonchat/message/${recordId}/${chapterId}`, messageObj);
  }


  /**
   * Function to get messages
   * @returns 
   */
  getGeneralMessages(): Observable<any> {
    return this.get('messages');
  }

  getIndexMessages(recordId: any, chapterId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/lessonchat/messages/${recordId}/${chapterId}`);
  }
}
