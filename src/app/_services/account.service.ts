import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { environment } from '@environments/environment';
import { UserInfo, HttpResponseData } from '@app/_models';
import {FaceAuthComponent} from '@app/_components/face-auth/face-auth.component';
import * as reqModels from '@app/_models/_requestModels'
import * as respModels from '@app/_models/_responseModels'
import * as enums from '@app/enums'
import { LoginFacialReqModel } from '@app/_models/_requestModels';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userInfoSubject: BehaviorSubject<UserInfo>;
    public userInfo: Observable<UserInfo>;

    constructor(
        private router: Router,
        private http: HttpClient,
        private dialog: MatDialog
    ) {
        this.userInfoSubject = new BehaviorSubject<UserInfo>(JSON.parse(localStorage.getItem('authToken')));
        this.userInfo = this.userInfoSubject.asObservable();
    }

    public get UserInfo(): UserInfo {
        return this.userInfoSubject.value;
    }

    login(existingUser: reqModels.LoginReqModel) {

        const httpOptions : Object = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'X-API-KEY' : 'jkbndsukfnleunfaskdjfblhabga54135813a3sgasd54dfgs1'
            }),
            responseType: 'json'
          };

        return this.http.post<HttpResponseData<respModels.SuccessfulLoginRespModel , enums.ClientsApiErrorCodes>>(`${environment.apiUrl}/api/authentication/signin`, existingUser , httpOptions)
            .pipe(map(successLogin => {
                if(successLogin.success == true){
                     //store user details and jwt token in local storage to keep user logged in between page refreshes
                    let info = new UserInfo();
                    info.x_seq = successLogin.data.x_Seq,
                    info.id = successLogin.data.id
                    this.userInfoSubject.next(info);

                    return successLogin;
                }

                
            }));
    }

    loginFaceRecognition(facialRecoUser : LoginFacialReqModel) {

        const httpOptions : Object = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'X-API-KEY' : 'jkbndsukfnleunfaskdjfblhabga54135813a3sgasd54dfgs1'
            }),
            responseType: 'json'
          };

        return this.http.post<HttpResponseData<respModels.SuccessfulLoginRespModel , enums.ClientsApiErrorCodes>>(`${environment.apiUrl}/api/authentication/facial/recognition`,facialRecoUser, httpOptions)
            .pipe(
                map(successLogin => {
                //store user details and jwt token in local storage to keep user logged in between page refreshes
                let info = this.UserInfo;

                info.userToken = successLogin.data.authToken;
                info.id = successLogin.data.id;

                localStorage.setItem('authToken', JSON.stringify(info));
                this.userInfoSubject.next(info);

                let dialogRef = this.dialog.closeAll();
                return successLogin;

                }),
                catchError((err) => {
                    console.log('error caught in service')
                    this.userInfoSubject.next(null);
                    let dialogRef = this.dialog.closeAll();
                    return throwError(err);    //Rethrow it back to component
                })
            );
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userInfoSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(newUser: reqModels.RegisterReqModel) {

        const httpOptions : Object = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'X-API-KEY' : 'jkbndsukfnleunfaskdjfblhabga54135813a3sgasd54dfgs1'
            }),
            responseType: 'json'
          };

        return this.http.post<respModels.SuccessfulRegisterRespModel>(`${environment.apiUrl}/api/MyAuthUser`, newUser , httpOptions);
    }

    getAll() {
        return this.http.get<UserInfo[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<UserInfo>(`${environment.apiUrl}/users/${id}`);
    }

    // update(id, params) {
    //     return this.http.put(`${environment.apiUrl}/users/${id}`, params)
    //         .pipe(map(x => {
    //             // update stored user if the logged in user updated their own record
    //             if (id == this.userValue.id) {
    //                 // update local storage
    //                 const user = { ...this.userValue, ...params };
    //                 localStorage.setItem('user', JSON.stringify(user));

    //                 // publish updated user to subscribers
    //                 this.authTokenSubject.next(user);
    //             }
    //             return x;
    //         }));
    // }

    // delete(id: string) {
    //     return this.http.delete(`${environment.apiUrl}/users/${id}`)
    //         .pipe(map(x => {
    //             // auto logout if the logged in user deleted their own record
    //             if (id == this.userValue.id) {
    //                 this.logout();
    //             }
    //             return x;
    //         }));
    // }
}