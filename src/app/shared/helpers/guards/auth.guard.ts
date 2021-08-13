import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SessionService } from '@app/shared/services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private userService : SessionService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const LoggedUser = this.userService.UserInfo.userToken;

        if (LoggedUser) {
            //this.router.navigate(['/home']);
            return true
        }else{
            this.router.navigate(['/account/login']);
            return false;
        }
    }
}