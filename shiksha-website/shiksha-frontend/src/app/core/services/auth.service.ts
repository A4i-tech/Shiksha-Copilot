import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface User {
  _id: string;
  identity: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  profiles: {
    teacher?: {
      state?: string;
      zone?: string;
      district?: string;
      block?: string;
      school?: any;
      preferredLanguage?: string;
      classes?: any[];
      facilities?: any[];
      isProfileCompleted?: boolean;
    };
    admin?: {
      state?: string;
      zones?: string[];
      districts?: string[];
    };
  };
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('userData');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(map(response => {
        if (response.success && response.data) {
          const user = response.data;
          localStorage.setItem('userData', JSON.stringify(user));
          if (user.token) {
            localStorage.setItem('token', user.token);
          }
          this.currentUserSubject.next(user);
          return user;
        }
        throw new Error('Login failed');
      }));
  }

  logout(): void {
    localStorage.removeItem('userData');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  getUserLocation(): { state: string | null; zone: string | null; district: string | null } {
    const user = this.getCurrentUser();
    return {
      state: user?.profiles.teacher?.state || user?.profiles.admin?.state || null,
      zone: user?.profiles.teacher?.zone || null,
      district: user?.profiles.teacher?.district || null
    };
  }

}
