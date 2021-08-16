import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddAppReqModel } from '@app/shared/models/requestModels';
import { AppDetailsRespModel } from '@app/shared/models/responseModels';
import { AlertService, SessionService } from '@app/shared/services';
import { first } from 'rxjs/operators';
import { AccountService } from '../../services/account.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";


@Component({
  selector: 'app-app-details',
  templateUrl: './app-details.component.html',
  styleUrls: ['./app-details.component.less']
})
export class AppDetailsComponent implements OnInit {

  appId : string
  appDetails : AppDetailsRespModel;
    
  constructor(
    private accountService : AccountService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sessionService : SessionService,
    private alertService : AlertService,
    private route: ActivatedRoute,
  ) {
    this.route.paramMap.subscribe( paramMap => {
      this.appId = paramMap.get('id');
    })

    
   }

   getAppDetails(){
    this.accountService.GetAppDetails(this.appId)
    .pipe(first())
    .subscribe({
      next: appDetails => {
        if(appDetails){
          this.appDetails = appDetails.data;
          this.firstFormGroup.patchValue({
            appName:  this.appDetails.appName,
            baseUrl : this.appDetails.baseUrl,
            redirectUrl : this.appDetails.redirectUrl
          });
        }
      },
      error: error => {
      }
    });
   }

  loading= false;
  firstFormGroup: FormGroup;

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      appName: [ '', Validators.required],
      baseUrl: ['',Validators.required],
      redirectUrl: ['',Validators.required]
    });
    this.getAppDetails();
  }

  // convenience getter for easy access to form fields
  get f() { return this.firstFormGroup.controls; }

  onSubmit(){

    if (this.firstFormGroup.invalid) {
      return;
    }

    this.loading = true;

    const post = new AddAppReqModel();
    post.appName = this.f.appName.value;
    post.baseUrl = this.f.baseUrl.value;
    post.redirectUrl = this.f.redirectUrl.value;

    this.accountService.EditApp(post,this.appId)
    .pipe(first())
    .subscribe({
      next: doneStatus => {
          if(doneStatus){
            this.loading = false;
            this.alertService.successAlert("App details changed successfully");
            this.getAppDetails();
          }
      },
      error: error => {
        this.loading = false;
      }
    });
  } 

  refreshSecrets(){

    this.accountService.RefreshSecrets(this.appId)
    .pipe(first())
    .subscribe({
      next: doneStatus => {
          if(doneStatus){
            this.alertService.successAlert("App secrets renewed successfully");
            this.getAppDetails();
          }
      },
      error: error => {
        this.loading = false;
      }
    });
  }

  //ERROR MESSAGES
  getAppNameErrorMessage(){
    if (this.firstFormGroup.controls.appName.errors.required) {
      return 'You must enter a value';
    }
  }
  
  getBaseUrlErrorMessage(){
    if (this.firstFormGroup.controls.baseUrl.errors.required) {
      return 'You must enter a value';
    }
  }

  getRedirectUrlErrorMessage(){
    if (this.firstFormGroup.controls.redirectUrl.errors.required) {
      return 'You must enter a value';
    }
  }
}
