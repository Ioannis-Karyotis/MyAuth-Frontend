import { Component } from '@angular/core';

import { AccountService } from './_services';
import { UserInfo } from './_models';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component(
{ 
    selector: 'app', 
    templateUrl: 'app.component.html'
})
export class AppComponent {
    userInfo: UserInfo;

    constructor(private accountService: AccountService , private translate: TranslateService) {
        this.accountService.userInfo.subscribe(x => this.userInfo = x);
        translate.setDefaultLang('en');
    }
    prepareRoute(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
      }

    logout() {
        this.accountService.logout();
    }
}