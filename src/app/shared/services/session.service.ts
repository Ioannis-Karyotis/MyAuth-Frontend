import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInfo } from '@app/shared/models/general';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private userInfoSubject = new BehaviorSubject<UserInfo>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  get AuthStatus(): boolean {
    return this.isLoggedInSubject.value;
  }

  isLoggedIn() : Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  get UserInfo(): UserInfo {
    return this.userInfoSubject.value;
  }

  getUserInfo(): Observable<UserInfo> {
    return this.userInfoSubject.asObservable();
  }


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
    });
        
    if(this.UserInfo.userToken != null){
      this.isLoggedInSubject.next(true);
    }

    localStorage.setItem('authToken', JSON.stringify(existingSession));
  }
  
  private setInitSession(){

    const newSessionInfo = new UserInfo(
      null,
      null,
      null
    )

    this.userInfoSubject.next({
      userToken :newSessionInfo.userToken,
      x_seq :newSessionInfo.x_seq,
      email : newSessionInfo.email
    });

    localStorage.setItem('authToken', JSON.stringify(newSessionInfo));
  }

  public setUserInfo(userInfo: UserInfo) {

    const session = this.UserInfo

    session.email = userInfo.email;
    session.userToken = userInfo.userToken;
    session.x_seq = userInfo.x_seq;

    this.userInfoSubject.next(session);
    localStorage.setItem('authToken', JSON.stringify(session));
    
    if(userInfo.userToken != null){
      this.isLoggedInSubject.next(true);
    }
    
  }

  public logout() {

    const session = this.UserInfo
    session.email = null;
    session.userToken = null;
    session.x_seq = null;
    localStorage.setItem('authToken', JSON.stringify(session));

    this.userInfoSubject.next(session);
    this.isLoggedInSubject.next(false)

    this.router.navigate(['/account/login']);

  }

  public logoutExternal() {

    const session = this.UserInfo
    session.email = null;
    session.userToken = null;
    session.x_seq = null;
    localStorage.setItem('authToken', JSON.stringify(session));

    this.userInfoSubject.next(session);
    this.isLoggedInSubject.next(false);
  }
}
