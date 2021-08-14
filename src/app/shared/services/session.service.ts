import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInfo } from '@app/shared/models/general';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private userInfoSubject = new BehaviorSubject<UserInfo>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(null);

  constructor(private router : Router) {
      if(localStorage.getItem('authToken')){
        this.setExistingSession()
      }else{
        this.setInitSession();
      }
  }


  private setExistingSession(){

    const existingSession = JSON.parse(localStorage.getItem('authToken'))

    this.userInfoSubject.next({
      userToken :existingSession.userToken,
      x_seq :existingSession.x_seq,
      email : existingSession.email,
      isAuthenticated : existingSession.isAuthenticated,
    });
        
    if(this.UserInfo.isAuthenticated){
      this.isLoggedInSubject.next(true);
    }

    localStorage.setItem('authToken', JSON.stringify(existingSession));
  }
  
  private setInitSession(){

    const newSessionInfo = new UserInfo(
      null,
      null,
      null,
      false,
    )

    this.userInfoSubject.next({
      userToken :newSessionInfo.userToken,
      x_seq :newSessionInfo.x_seq,
      email : newSessionInfo.email,
      isAuthenticated : newSessionInfo.isAuthenticated
    });

    localStorage.setItem('authToken', JSON.stringify(newSessionInfo));
  }


  public changeSessionDetails(fisrtName : string, lastName : string){

    const existingSession = JSON.parse(localStorage.getItem('authToken'))

    existingSession.firstName = fisrtName;
    existingSession.lastName = lastName;
    this.userInfoSubject.next(existingSession);
        
    if(this.UserInfo.isAuthenticated){
      this.isLoggedInSubject.next(true);
    }

    localStorage.setItem('authToken', JSON.stringify(existingSession));
  }

  get UserInfo(): UserInfo {
      return this.userInfoSubject.value;
  }

  public setUserInfo(userInfo: UserInfo) {

    const session = this.UserInfo

    session.isAuthenticated = userInfo.isAuthenticated
    session.email = userInfo.email;
    session.userToken = userInfo.userToken;
    session.x_seq = userInfo.x_seq;

    this.userInfoSubject.next(session);
    localStorage.setItem('authToken', JSON.stringify(session));
    
    if(userInfo.isAuthenticated){
      this.isLoggedInSubject.next(true);
    }
    
  }

  isLoggedIn() : Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getUserInfo(): Observable<UserInfo> {
    return this.userInfoSubject.asObservable();
  }

  public logout() {

    const session = this.UserInfo
    session.isAuthenticated = null;
    session.email = null;
    session.userToken = null;
    session.x_seq = null;
    localStorage.setItem('authToken', JSON.stringify(session));

    this.userInfoSubject.next(session);
    this.isLoggedInSubject.next(null)

    this.router.navigate(['/account/login']);

  }
}
