import { Injectable } from '@angular/core';
import { HttpContextToken } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

const DEFAULT_LOADER_MESSAGE = 'Loading...';
export const LOADER_MESSAGE = new HttpContextToken<string | null>(() => null);

@Injectable({ providedIn: 'root' })
export class LoaderMessageService {
  message$ = new BehaviorSubject(DEFAULT_LOADER_MESSAGE);

  set(message?: string | null) {
    this.message$.next(message ?? DEFAULT_LOADER_MESSAGE);
  }
}
