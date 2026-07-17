import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  /**
   * subject which results true false based on user login information
   */
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Class constructor
   * @param router 
   */
  constructor(private router: Router) {
    this.loggedIn.next(this.isLoggedIn());
  }

  /**
   * Method to check if the user is logged in
   * @returns boolean
   */
  isLoggedIn(): boolean {
    return !!this.getLocalStorageItem('token');
  }

  /**
   * Method to get the current login status as an Observable
   * @returns Observable
   */
  getLoggedInStatus(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  /**
   * Method to set a value in localStorage
   * @param key 
   * @param value 
   */
  setLocalStorageItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Method to get a value from localStorage
   * @param key 
   * @returns 
   */
  getLocalStorageItem(key: string) {
    const value = localStorage.getItem(key);
    return value; 
  }

  /**
   * Method to remove a value from localStorage
   * @param key 
   */
  removeLocalStorageItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Method to set token to localstorage
   * @param token 
   */
  setToken(token:string): void {
      this.setLocalStorageItem('token', token);
      this.loggedIn.next(true);
      this.router.navigate(['/']);
  }

  /**
   * Method to perform logout
   */
  logout(): void {
    this.removeLocalStorageItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Helper to identify if a user is a teacher only (end-user for surveys)
   * i.e. has standard or power role, and does not have administrative/management roles
   */
  isTeacherOnly(user: any): boolean {
    const roles: string[] = Array.isArray(user?.role) ? user.role : [user?.role].filter(Boolean);
    if (!roles.length) return false;
    const lower = roles.map(r => String(r).toLowerCase());
    const hasTeacherRole = lower.some(r => r === 'standard' || r === 'power');
    const hasExcludeRole = lower.some(r => {
      return ['admin', 'manager', 'super_admin', 'coordinator', 'trainer'].includes(r);
    });
    return hasTeacherRole && !hasExcludeRole;
  }
}
