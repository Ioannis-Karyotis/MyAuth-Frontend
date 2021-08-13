import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { HttpResponseData } from '../models/general';
import { SessionService } from './session.service';
import { HttpOptions } from '@app/shared/constants';
import { SuccessfulExternalLoginRespModel, SuccessfulLoginFirstStepRespModel, SuccessfulLoginRespModel, SuccessfulRegisterRespModel } from '@app/shared/models/responseModels';
import { ClientsApiErrorCodes } from '../enums';
import { ExternalLoginReqModel, LoginFacialReqModel, LoginReqModel, RegisterReqModel } from '@app/shared/models/requestModels';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private httpOptions: Object;

    constructor(
        private http: HttpClient,
    ) {
         this.httpOptions = HttpOptions;
    }

  public SignUp(newUser: RegisterReqModel){
    return this.http.post<HttpResponseData<SuccessfulLoginRespModel , ClientsApiErrorCodes>>(`${environment.apiUrl}/api/authentication/sign-up`, newUser , this.httpOptions)
  }

  public SignIn(existingUser : LoginReqModel){
    return this.http.post<HttpResponseData<SuccessfulLoginFirstStepRespModel , ClientsApiErrorCodes>>(`${environment.apiUrl}/api/authentication/sign-in`, existingUser , this.httpOptions)
  }

  public FacialAuthentication(facialRecoUser : LoginFacialReqModel){
    return this.http.post<HttpResponseData<SuccessfulLoginRespModel , ClientsApiErrorCodes>>(`${environment.apiUrl}/api/authentication/facial/authentication`,facialRecoUser, this.httpOptions)
  }


  public FacialRegistration(facialRecoUser : LoginFacialReqModel){
    return this.http.post<HttpResponseData<SuccessfulLoginRespModel , ClientsApiErrorCodes>>(`${environment.apiUrl}/api/authentication/facial/registration`,facialRecoUser, this.httpOptions)
  }

  public ExternalSignIn(existingUser : ExternalLoginReqModel){
    return this.http.post<HttpResponseData<SuccessfulLoginFirstStepRespModel , ClientsApiErrorCodes>>(`${environment.apiUrl}/accounts/oauth2/external/sign-in`, existingUser , this.httpOptions)
  }

  public ExternalFacialAuthentication(facialRecoUser : LoginFacialReqModel){
    return this.http.post<HttpResponseData<SuccessfulExternalLoginRespModel , ClientsApiErrorCodes>>(`${environment.apiUrl}/accounts/oauth2/external/facial/authentication`,facialRecoUser, this.httpOptions)
  }

}
