import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddAppReqModel } from '@app/shared/models/requestModels';
import { AlertService, SessionService } from '@app/shared/services';
import { first } from 'rxjs/internal/operators/first';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-add-new-app',
  templateUrl: './add-new-app.component.html',
  styleUrls: ['./add-new-app.component.less']
})
export class AddNewAppComponent implements OnInit {
  
  constructor(
    private accountService : AccountService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sessionService : SessionService,
    private alertService : AlertService,
  ) { }

  loading= false;
  firstFormGroup: FormGroup;

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      appName: [ '', Validators.required],
      baseUrl: ['',Validators.required],
      redirectUrl: ['',Validators.required]
    });
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

    this.accountService.AddNewApp(post)
    .pipe(first())
    .subscribe({
      next: doneStatus => {
          if(doneStatus){
            this.alertService.successAlert("App added successfully");
            this.router.navigate([`/account/my-apps/app-details/${doneStatus.data}`]);
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
