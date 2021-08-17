import { Injectable } from '@angular/core';
import { AddAppReqModel, ChangeDetailsReqModel, ChangePassReqModel } from '@app/shared/models/requestModels';
import { ApiService } from '@app/shared/services';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private apiService : ApiService
  ) { }

  getUserDetails(){
    return this.apiService.UserDetails()
    .pipe(
      map(successResp => {
        return successResp;
      }),
      catchError((err) => {
          console.log('error caught in service')
          return throwError(err);    //Rethrow it back to component
      })
    );
  }

  getUserConnectedApps(){
    return this.apiService.UserConnectedApps()
    .pipe(
      map(successResp => {
        return successResp;
      }),
      catchError((err) => {
          console.log('error caught in service')
          return throwError(err);    //Rethrow it back to component
      })
    );
  }

  DisconnectApp(id : string){
    return this.apiService.DisconnectApp(id)
    .pipe(
      map(successResp => {
        return successResp;
      }),
      catchError((err) => {
          console.log('error caught in service')
          return throwError(err);    //Rethrow it back to component
      })
    );
  }

  getΜyApps(){
    return this.apiService.MyApps()
    .pipe(
      map(successResp => {
        return successResp;
      }),
      catchError((err) => {
          console.log('error caught in service')
          return throwError(err);    //Rethrow it back to component
      })
    );
  }

  GetAppDetails(id:string){
    return this.apiService.GetAppDetails(id)
    .pipe(
      map(successResp => {
        return successResp;
      }),
      catchError((err) => {
          console.log('error caught in service')
          return throwError(err);    //Rethrow it back to component
      })
    );
  }

  AddNewApp(post:AddAppReqModel){
    return this.apiService.AddNewApp(post)
    .pipe(
      map(successResp => {
        return successResp;
      }),
      catchError((err) => {
          console.log('error caught in service')
          return throwError(err);    //Rethrow it back to component
      })
    );
  }

  EditApp(post:AddAppReqModel,id:string){
    return this.apiService.EditApp(post,id)
    .pipe(
      map(successResp => {
        return successResp;
      }),
      catchError((err) => {
          console.log('error caught in service')
          return throwError(err);    //Rethrow it back to component
      })
    );
  }


  deleteApp(id:string){
    return this.apiService.DeleteApp(id)
    .pipe(
      map(successResp => {
        return successResp;
      }),
      catchError((err) => {
          console.log('error caught in service')
          return throwError(err);    //Rethrow it back to component
      })
    );
  }

  RefreshSecrets(id:string){
    return this.apiService.RefreshSecrets(id)
    .pipe(
      map(successResp => {
        return successResp;
      }),
      catchError((err) => {
          console.log('error caught in service')
          return throwError(err);    //Rethrow it back to component
      })
    );
  }

  ChangeUserDetails(post: ChangeDetailsReqModel) {
    return this.apiService.ChangeUserDetails(post)
    .pipe(
      map(successResp => {
        return successResp;
      }),
      catchError((err) => {
          console.log('error caught in service')
          return throwError(err);    //Rethrow it back to component
      })
    );
  }

  ChangePassword(post: ChangePassReqModel) {
    return this.apiService.ChangePassword(post)
    .pipe(
      map(successResp => {
        return successResp;
      }),
      catchError((err) => {
          console.log('error caught in service')
          return throwError(err);    //Rethrow it back to component
      })
    );
  }



}
