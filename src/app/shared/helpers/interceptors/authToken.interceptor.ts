import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { SessionService } from '@app/shared/services';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
export class AuthTokenInterceptor implements HttpInterceptor {
    constructor(
        private sessionService : SessionService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // // add auth header with jwt if user is logged in and request is to the api url
        const user = this.sessionService.UserInfo;
        const isLoggedIn = this.sessionService.AuthStatus;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    AuthGate: `Bearer_${user.userToken}`
                }
            });
        }

        return next.handle(request);
    }
}