import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { UtilityService } from '../services/utility.service';
import { AuthorizationService } from '../services/authorization.service';
import { LOADER_MESSAGE, LoaderMessageService } from '../services/loader-message.service';
import { LOADER_RESTRICTED_URLS } from 'src/app/shared/utility/constant.util';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  pendingRequests = 0;
  /**
   * Class constructor
   * @param spinner NgxSpinnerService
   * @param utilityService UtilityService
   * @param authorizationService AuthorizationService
   */
  constructor(
    private spinner: NgxSpinnerService,
    private utilityService: UtilityService,
    private authorizationService: AuthorizationService,
    private loaderMessage: LoaderMessageService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.pendingRequests+=1; 
    if (!LOADER_RESTRICTED_URLS.some(api => request.url.includes(api))) {
      this.loaderMessage.set(request.context.get(LOADER_MESSAGE));
    }
    if (this.pendingRequests === 1 && !LOADER_RESTRICTED_URLS.some(api => request.url.includes(api))) {
      this.spinner.show();
    }

    const token = localStorage.getItem('token');

    const headers: any = {
      authorization: `${token}`,
    };

    const authReq = request.clone({
      setHeaders: headers,
    });

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error.status === 401 && this.authorizationService.isLoggedIn()) {
          this.utilityService.logout();
        } else if (error.status === 0 || error.status >= 500) {
          console.error('[HttpConfigInterceptor] backend unavailable, redirecting to /error/503', { status: error.status, url: authReq.url });
          this.router.navigate(['/error/503']);
        }
        return throwError(() => error);
      }),
      finalize(() => {
        this.pendingRequests-=1;
        if (this.pendingRequests === 0) {
          this.spinner.hide()
          this.loaderMessage.set()
        }
      })
    );
  }
}
