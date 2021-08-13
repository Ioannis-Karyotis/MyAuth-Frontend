import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpResponseData } from '@app/shared/models/general';

import { UpperCasePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import * as enums from '@app/shared/enums'
import { Router } from '@angular/router';
import { AlertService, SessionService } from '@app/shared/services';

@Injectable({
    providedIn: 'root'
  })
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private injector: Injector, private _snackBar : MatSnackBar,private alertService: AlertService) {

    }

    intercept(request: HttpRequest<HttpResponseData<any, enums.ClientsApiErrorCodes>>, next: HttpHandler): Observable<HttpEvent<HttpResponseData<any, enums.ClientsApiErrorCodes>>> {
        let sessionService = this.injector.get(SessionService);

        return next.handle(request).pipe(catchError(err => {
            const error = err.error.error || err.statusText;

            if ([401, 403].includes(err.status) && sessionService.UserInfo) {
                // auto logout if 401 or 403 response returned from api
                sessionService.logout();
                
            }else if([500].includes(err.status)){
                 
                this.injector.get(TranslateService).get('ApiStatus.' + error.description).subscribe((res: string) => {
                    this.alertService.errorAlert(res);
                });

            }
            
            return throwError(error);
        }))
    }
}