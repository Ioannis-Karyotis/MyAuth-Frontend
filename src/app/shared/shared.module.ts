import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaceAuthComponent } from './components/face-auth/face-auth.component';
import {LoaderComponent } from './components/loader/loader.component';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthTokenInterceptor, ErrorInterceptor,LoaderInterceptor, RenewAuthTokenInterceptor } from '@app/shared/helpers/interceptors';
import { CountdownModule } from 'ngx-countdown';
import { FaceRegistrationComponent } from './components/face-registration/face-registration.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    FaceAuthComponent,
    LoaderComponent,
    FaceRegistrationComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDialogModule,
    CountdownModule,
    MatFormFieldModule,
    MatInputModule 
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RenewAuthTokenInterceptor, multi: true },
 ],
 exports :[
    LoaderComponent,
    MaterialModule,
    
  ]
})
export class SharedModule { }
