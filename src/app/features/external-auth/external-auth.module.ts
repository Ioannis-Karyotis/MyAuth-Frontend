import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalAuthRoutingModule } from './external-auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { MaterialModule } from '@app/shared/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { CountdownModule } from 'ngx-countdown';
import { FailureExternalLoginComponent } from './components/failure-external-login/failure-external-login.component';
import { ExternalLoginComponent } from './components/external-login/external-login.component';
import { ExternalFaceAuthComponent } from './components/external-face-auth/external-face-auth.component';



@NgModule({
  declarations: [ExternalLoginComponent,ExternalFaceAuthComponent,FailureExternalLoginComponent],
  imports: [
    CommonModule,
    ExternalAuthRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    CountdownModule
  ]
})
export class ExternalAuthModule { }
