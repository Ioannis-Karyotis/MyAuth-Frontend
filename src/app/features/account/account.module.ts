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


@NgModule({
  declarations: [HomeComponent, UserDetailsComponent],
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