import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserInfo } from '@app/shared/models/general';
import { ExternalLoginAuthTokenReqModel, ExternalLoginReqModel, LoginFacialReqModel } from '@app/shared/models/requestModels';
import { ApiService, SessionService } from '@app/shared/services';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExternalAuthService {

  userInfo: any;
  userInfoSubject: any;

  constructor(
    private apiService : ApiService,
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private sessionService : SessionService
  ) { }

  ExternalSignIn(existingUser : ExternalLoginReqModel){
    return this.apiService.ExternalSignIn(existingUser)
    .pipe(
      map(successLogin => {
          return successLogin;
      }),
      catchError((err) => {
          console.log('error caught in service')
          return throwError(err);    //Rethrow it back to component
      })
    );
  }

  ExternalAuthTokenSignIn(existingUser : ExternalLoginAuthTokenReqModel){
    return this.apiService.ExternalAuthTokenSignIn(existingUser)
    .pipe(
      map(successLogin => {
          return successLogin;
      }),
      catchError((err) => {
          console.log('error caught in service')
          return throwError(err);    //Rethrow it back to component
      })
    );
  }

  ExternalFacialAuthentication(existingUser : LoginFacialReqModel){
    return this.apiService.ExternalFacialAuthentication(existingUser)
    .pipe(
      map(successLogin => {
          this.dialog.closeAll();
          return successLogin;
      }),
      catchError((err) => {
          this.dialog.closeAll();
          console.log('error caught in service')
          return throwError(err);    //Rethrow it back to component
      })
    );
  }

}
