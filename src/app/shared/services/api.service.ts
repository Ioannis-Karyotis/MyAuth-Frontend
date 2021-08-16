import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { HttpResponseData } from '../models/general';
import { SessionService } from './session.service';
import { HttpOptions } from '@app/shared/constants';
import { AppDetailsRespModel, SuccessfulExternalLoginRespModel, SuccessfulLoginFirstStepRespModel, SuccessfulLoginRespModel, SuccessfulRegisterRespModel, UserConnectedAppsRespModel, UserDetailDetailsRespModel } from '@app/shared/models/responseModels';
import { ClientsApiErrorCodes } from '../enums';
import { AddAppReqModel, ChangeDetailsReqModel, ChangePassReqModel, ExternalLoginAuthTokenReqModel, ExternalLoginReqModel, LoginFacialReqModel, LoginReqModel, RegisterReqModel } from '@app/shared/models/requestModels';

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

  public ExternalAuthTokenSignIn(existingUser : ExternalLoginAuthTokenReqModel){
    return this.http.post<HttpResponseData<SuccessfulExternalLoginRespModel , ClientsApiErrorCodes>>(`${environment.apiUrl}/accounts/oauth2/external/sign-in/auth/token`,existingUser, this.httpOptions)
  }

  public UserDetails(){
    return this.http.get<HttpResponseData<UserDetailDetailsRespModel, ClientsApiErrorCodes>>(`${environment.apiUrl}/api/account/user-details`, this.httpOptions)
  }

  public ChangeUserDetails(post: ChangeDetailsReqModel){
    return this.http.post<HttpResponseData<boolean, ClientsApiErrorCodes>>(`${environment.apiUrl}/api/account/change-user-details`,post,this.httpOptions)
  }

  public ChangePassword(post: ChangePassReqModel){
    return this.http.post<HttpResponseData<boolean, ClientsApiErrorCodes>>(`${environment.apiUrl}/api/account/change-user-password`,post,this.httpOptions)
  }

  public UserConnectedApps(){
    return this.http.get<HttpResponseData<UserConnectedAppsRespModel, ClientsApiErrorCodes>>(`${environment.apiUrl}/api/account/user-connected-apps`, this.httpOptions)
  }

  public DisconnectApp(id:string){
    return this.http.post<HttpResponseData<boolean, ClientsApiErrorCodes>>(`${environment.apiUrl}/api/account/disconnect-app/${id}`,"", this.httpOptions)
  }

  public MyApps(){
    return this.http.get<HttpResponseData<UserConnectedAppsRespModel, ClientsApiErrorCodes>>(`${environment.apiUrl}/api/account/my-apps`, this.httpOptions)
  }

  public AddNewApp(post:AddAppReqModel){
    return this.http.post<HttpResponseData<string, ClientsApiErrorCodes>>(`${environment.apiUrl}/api/account/add-new-app`,post, this.httpOptions)
  }

  public EditApp(post:AddAppReqModel,id:string){
    return this.http.post<HttpResponseData<boolean, ClientsApiErrorCodes>>(`${environment.apiUrl}/api/account/edit-app-details/${id}`,post, this.httpOptions)
  }

  public RefreshSecrets(id:string){
    return this.http.post<HttpResponseData<boolean, ClientsApiErrorCodes>>(`${environment.apiUrl}/api/account/refresh-app-secrets/${id}`,"", this.httpOptions)
  }

  public GetAppDetails(id:string){
    return this.http.get<HttpResponseData<AppDetailsRespModel, ClientsApiErrorCodes>>(`${environment.apiUrl}/api/account/get-app-details/${id}`, this.httpOptions)
  }

  
}
