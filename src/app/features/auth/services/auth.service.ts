import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserInfo } from '@app/shared/models/general';
import { LoginFacialReqModel, LoginReqModel, RegisterReqModel } from '@app/shared/models/requestModels';
import { ApiService, SessionService } from '@app/shared/services';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userInfo: any;
  userInfoSubject: any;

  constructor(
    private apiService : ApiService,
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private sessionService : SessionService
  ) { }

  SignUp(newUser: RegisterReqModel){
    return this.apiService.SignUp(newUser)
    .pipe(
      map(successSignUp => {
        let info = this.sessionService.UserInfo

        info.userToken = successSignUp.data.authToken;
        info.x_seq = null;

        this.sessionService.setUserInfo(info);
        this.dialog.closeAll();
        return successSignUp;
      }),
      catchError((err) => {
          console.log('error caught in service')
          this.dialog.closeAll();
          return throwError(err);    //Rethrow it back to component
      })
    );
  }

  SignUpFaceDescriptor(facialRecoUser : LoginFacialReqModel){
    return this.apiService.FacialRegistration(facialRecoUser)
    .pipe(
      map(successLogin => {
        let info = this.sessionService.UserInfo;

        info.userToken = successLogin.data.authToken;
        info.email = successLogin.data.email;
        info.x_seq = null;

        localStorage.setItem('authToken', JSON.stringify(info));
        this.sessionService.setUserInfo(info);

        this.dialog.closeAll();
        return successLogin;
      }),
      catchError((err) => {
          console.log('error caught in service')
          return throwError(err);    //Rethrow it back to component
      })
    );
  }

  SignIn(existingUser : LoginReqModel){
    return this.apiService.SignIn(existingUser)
    .pipe(
      map(successLogin => {
        if(successLogin.success == true){
          let info = this.sessionService.UserInfo

          info.x_seq = successLogin.data.x_seq

          this.sessionService.setUserInfo(info);
        
          
          return successLogin;
        }
      }),
      catchError((err) => {
          console.log('error caught in service')
          return throwError(err);    //Rethrow it back to component
      })
    );
  }

  FacialAuthentication(facialRecoUser : LoginFacialReqModel){
    return this.apiService.FacialAuthentication(facialRecoUser)
    .pipe(
      map(successLogin => {
        let info = this.sessionService.UserInfo;

        info.userToken = successLogin.data.authToken;
        info.email = successLogin.data.email;
        info.x_seq = null;

        localStorage.setItem('authToken', JSON.stringify(info));
        this.sessionService.setUserInfo(info);

        this.dialog.closeAll();
        return successLogin;
      }),
      catchError((err) => {
          console.log('error caught in service')
          this.dialog.closeAll();
          return throwError(err);    //Rethrow it back to component
      })
    );
  }
}
