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



@NgModule({
  declarations: [
    FaceAuthComponent,
    LoaderComponent,
    FaceRegistrationComponent,
    
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CountdownModule 
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
  ],
})
export class SharedModule { }
