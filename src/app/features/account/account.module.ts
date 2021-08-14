import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { MaterialModule } from '@app/shared/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { ConnectedAppsComponent } from './components/connected-apps/connected-apps.component';
import { MyAppsComponent } from './components/my-apps/my-apps.component';


@NgModule({
  declarations: [HomeComponent, UserDetailsComponent, ConnectedAppsComponent, MyAppsComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule
  ]
})
export class AccountModule { }