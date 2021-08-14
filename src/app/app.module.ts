import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import * as faceapi from 'face-api.js';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import { SharedModule } from '@app/shared/shared.module';
import { SessionService } from './shared/services';

registerLocaleData(localeEn , 'en');

@NgModule({
    imports: [
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
          }),
          CommonModule,
          BrowserModule,
          HttpClientModule,
          SharedModule,
          FlexLayoutModule,
          FormsModule,
          ReactiveFormsModule,
          AppRoutingModule,
          BrowserAnimationsModule,
    ],
    declarations: [
        AppComponent
    ],
    exports:[
        TranslateModule,
        SharedModule
    ],
    bootstrap: [AppComponent],
    schemas : [CUSTOM_ELEMENTS_SCHEMA],
    providers : [
        {provide: APP_INITIALIZER, useFactory: loadRemoteEnv,deps: [SessionService], multi: true}
    ]
})

export class AppModule {};


export function HttpLoaderFactory(http: HttpClient): any {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function loadRemoteEnv(sessionService: SessionService) {
    return () => {
        return new Promise<void>((resolve) => {
            sessionService.isLoggedIn().subscribe(async loggedIn => {
                if(loggedIn == true) {
                    resolve();
                }else{
                    await faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/faceModels');
                    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/faceModels');
                    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/faceModels');
                    await faceapi.nets.faceExpressionNet.loadFromUri('/assets/faceModels');
                    await faceapi.loadTinyFaceDetectorModel('/assets/faceModels');
                    resolve();

                    // let base_image = new Image();
                    // base_image.src = "/assets/startFaceDetect.png";
                    // base_image.onload = function() {
                    //     const fullFaceDescription = faceapi
                    //     .detectSingleFace(base_image)
                    //     .withFaceLandmarks()
                    //     .withFaceExpressions()
                    //     .withFaceDescriptor()
                    //     .run()
                    //     .then(res => {
                    //         resolve();
                    //     });
                    // };
                }
            });
            
        })
    }
}