import { Component } from '@angular/core';

import { UserInfo } from '@app/_models';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: UserInfo;

    constructor(private accountService: AccountService) {
        this.user = this.accountService.UserInfo;
    }
}