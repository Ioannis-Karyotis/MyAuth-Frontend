import { Injectable } from '@angular/core';
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



}
