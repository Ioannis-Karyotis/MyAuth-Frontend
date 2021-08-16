import { Component, OnInit } from '@angular/core';
import * as faceapi from 'face-api.js';
import { UserInfo } from './shared/models/general';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from './shared/services';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';

@Component(
{ 
    selector: 'app', 
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.less']
})
export class AppComponent{
    isLoggedIn: boolean;
    user: UserInfo;

    constructor(
        public translate: TranslateService ,
        private sessionService : SessionService ,
        public dialog: MatDialog
      ){
        translate.use('en');
        this.sessionService.isLoggedIn().subscribe(x => {
          this.isLoggedIn = x
        });
        this.sessionService.getUserInfo().subscribe(info => {
          this.user = info
        });
    }

    logout() {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '500px',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result == 'Yes'){
          this.sessionService.logout();
        }
      });
    }
}