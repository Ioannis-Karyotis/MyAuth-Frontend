import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AccountService } from '@app/_services/account.service';
import { HttpResponseData } from '@app/_models';

import { UpperCasePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private injector: Injector) {
        
    }

    intercept(request: HttpRequest<HttpResponseData<any>>, next: HttpHandler): Observable<HttpEvent<HttpResponseData<any>>> {
        let accountService = this.injector.get(AccountService);
        let _snackBar = this.injector.get(MatSnackBar);
        let translate = this.injector.get(TranslateService);

        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');

         // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('en');

        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].includes(err.status) && accountService.UserInfo) {
                // auto logout if 401 or 403 response returned from api
                accountService.logout();
            }
            const error = err.error.error || err.statusText;
            console.error(err);

            translate.get('ApiStatus.' + error).subscribe((res: string) => {
                _snackBar.open(res ,'OK',{
                    duration : 3000,
                    panelClass: ['failure-snackbar']
                });
            });

            

            return throwError(error);
        }))
    }
}