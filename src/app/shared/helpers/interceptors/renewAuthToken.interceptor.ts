import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { HttpResponseData } from '@app/shared/models/general';

import { MatSnackBar } from '@angular/material/snack-bar';

import * as enums from '@app/shared/enums'
import { AlertService, SessionService } from '@app/shared/services';

@Injectable({
    providedIn: 'root'
})
export class RenewAuthTokenInterceptor implements HttpInterceptor {
    constructor(private injector: Injector, private _snackBar : MatSnackBar,private alertService: AlertService) {}

    intercept(request: HttpRequest<HttpResponseData<any, enums.ClientsApiErrorCodes>>, next: HttpHandler): Observable<HttpEvent<HttpResponseData<any, enums.ClientsApiErrorCodes>>> {
        let sessionService = this.injector.get(SessionService);

        return next.handle(request).pipe(
            tap((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                
                    //console.log(event.headers);
                    // const newAuthToken = event.headers.get('X-AUTH-DASH');
                    // let info = sessionService.UserInfo;
                    // info.userToken = newAuthToken;
                    // localStorage.setItem('authToken', JSON.stringify(info));
                    // sessionService.setUserInfo(info);
                
              }
            })
        )
    }
}