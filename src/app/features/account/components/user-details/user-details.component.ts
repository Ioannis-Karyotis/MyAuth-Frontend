import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordPatternValidator, PasswordsMatchValidator } from '@app/shared/directives/validators';
import { ChangeDetailsReqModel, ChangePassReqModel } from '@app/shared/models/requestModels';
import { AlertService, SessionService } from '@app/shared/services';
import { first } from 'rxjs/operators';
import { AccountService } from './../../services/account.service';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.less']
})
export class UserDetailsComponent implements OnInit {
 
  constructor(
    private accountService : AccountService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sessionService : SessionService,
    private alertService : AlertService,
  ) { }

  email: any;
  firstName: any;
  lastName: any;

  loadingDetails = false;
  loadingPass= false;

  hide = true;
  hide2 = true;
  hide3 = true;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  disabledDetails =  true;
  disabledPass =  true;

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      name: [ {value:  '', disabled: this.disabledDetails}, Validators.required],
      surname: [{value: '', disabled: this.disabledDetails},Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      oldPass: [{value: "**********", disabled: this.disabledPass}, Validators.compose([
        Validators.required,
        PasswordPatternValidator(/\d/, { hasNumber: true }),
        PasswordPatternValidator(/[A-Z]/, { hasCapitalCase: true }),
        PasswordPatternValidator(/[a-z]/, { hasSmallCase: true }),
        PasswordPatternValidator(/[!@#$%^&*(),.?":{}|<>]/,{ hasSpecialCharacters: true }),
        Validators.minLength(6)]),
      ],
      password: [{value: "**********", disabled: this.disabledPass},Validators.compose([
        Validators.required,
        PasswordPatternValidator(/\d/, { hasNumber: true }),
        PasswordPatternValidator(/[A-Z]/, { hasCapitalCase: true }),
        PasswordPatternValidator(/[a-z]/, { hasSmallCase: true }),
        PasswordPatternValidator(/[!@#$%^&*(),.?":{}|<>]/,{ hasSpecialCharacters: true }),
        Validators.minLength(6)])
      ],
      confirmPassword: [{value: "**********", disabled: this.disabledPass},Validators.compose([
        Validators.required,
        PasswordPatternValidator(/\d/, { hasNumber: true }),
        PasswordPatternValidator(/[A-Z]/, { hasCapitalCase: true }),
        PasswordPatternValidator(/[a-z]/, { hasSmallCase: true }),
        PasswordPatternValidator(/[!@#$%^&*(),.?":{}|<>]/,{ hasSpecialCharacters: true }),
        Validators.minLength(6)]),
      ]
    },{validators : PasswordsMatchValidator});

    this.getUserDetails();
  }

  getUserDetails(): void {
    this.accountService.getUserDetails()
    .pipe(first())
    .subscribe({
        next: successResp => {
          this.email = successResp.data.email;
          this.firstName = successResp.data.firstName;
          this.lastName = successResp.data.lastName;
          this.firstFormGroup.patchValue({
            name:  this.firstName,
            surname : this.lastName
          });
        },
        error: error => {
            
        }
    });
  
  }



  // convenience getter for easy access to form fields
  get f() { return this.firstFormGroup.controls; }
  get f2() { return this.secondFormGroup.controls; }
  get t2() { return this.secondFormGroup }


  toggleVisibilityDetails(){
    this.disabledDetails = !this.disabledDetails
    if(!this.disabledDetails){
      this.firstFormGroup.controls['name'].enable();
      this.firstFormGroup.controls['surname'].enable();
    }else{
      this.firstFormGroup.controls['name'].disable();
      this.firstFormGroup.controls['surname'].disable();
    }
  }

  toggleVisibilityPass(){
    this.disabledPass = !this.disabledPass
    if(!this.disabledPass){
      this.secondFormGroup.controls['oldPass'].enable();
      this.secondFormGroup.controls['password'].enable();
      this.secondFormGroup.controls['confirmPassword'].enable();

      this.secondFormGroup.patchValue({
        oldPass: "",
        password: "",
        confirmPassword: ""
      });

    }else{
      this.secondFormGroup.controls['oldPass'].disable();
      this.secondFormGroup.controls['password'].disable();
      this.secondFormGroup.controls['confirmPassword'].disable();

      this.secondFormGroup.patchValue({
        oldPass: "**********",
        password: "**********",
        confirmPassword: "**********"
      });
    }
  }

  onSubmitDetails(){

  if (this.firstFormGroup.invalid) {
    return;
  }

  this.loadingDetails = true;

  const post = new ChangeDetailsReqModel();
  post.firstName = this.f.name.value;
  post.lastName = this.f.surname.value;

  this.accountService.ChangeUserDetails(post)
    .pipe(first())
    .subscribe({
        next: doneStatus => {
            if(doneStatus){
              this.loadingDetails = false;
              this.toggleVisibilityDetails();
              this.alertService.successAlert("User details changed successfully"); 
            }
        },
        error: error => {
            this.loadingDetails = false;
        }
    });
}

onSubmitPass(){
  //stop here if form is invalid
  if (this.secondFormGroup.invalid) {
    return;
  }

  this.loadingPass = true;

  const post = new ChangePassReqModel();
  post.oldPass = this.f2.oldPass.value;
  post.newPass = this.f2.password.value;
  post.newPassVal = this.f2.confirmPassword.value;

  this.accountService.ChangePassword(post)
    .pipe(first())
    .subscribe({
        next: doneStatus => {
            if(doneStatus){
              this.loadingPass = false;
              this.toggleVisibilityPass();
              this.alertService.successAlert("Password Changed Successfully"); 
            }
        },
        error: error => {
            this.loadingPass = false;
        }
    });
  }

  //ERROR MESSAGES
  getNameErrorMessage(){
    if (this.firstFormGroup.controls.name.errors.required) {
      return 'You must enter a value';
    }
  }

  getSurnameErrorMessage(){
    if (this.firstFormGroup.controls.surname.errors.required) {
      return 'You must enter a value';
    }
  }

  getOldPassErrorMessage(){
    if (this.secondFormGroup.controls.oldPass.errors.required) {
      return 'You must enter a value';
    }
    else if(this.secondFormGroup.controls.oldPass.errors.minlength){
        return 'Password must have at least 6 characters';
    }
    else if(this.secondFormGroup.controls.oldPass.errors.hasNumber){
        return 'Password must contain at least one number';
    }
    else if(this.secondFormGroup.controls.oldPass.errors.hasCapitalCase){
        return 'Password must contain at least one capital letter';
    }
    else if(this.secondFormGroup.controls.oldPass.errors.hasSpecialCharacters){
        return 'Password must contain at least one special character';
    }
  }

  getNewPassErrorMessage(){
    if (this.secondFormGroup.controls.password.errors.required) {
      return 'You must enter a value';
    }
    else if(this.secondFormGroup.controls.password.errors.minlength){
        return 'Password must have at least 6 characters';
    }
    else if(this.secondFormGroup.controls.password.errors.hasNumber){
        return 'Password must contain at least one number';
    }
    else if(this.secondFormGroup.controls.password.errors.hasCapitalCase){
        return 'Password must contain at least one capital letter';
    }
    else if(this.secondFormGroup.controls.password.errors.hasSpecialCharacters){
        return 'Password must contain at least one special character';
    }
  }

  getNewPassValErrorMessage(){
    if (this.secondFormGroup.controls.confirmPassword.errors.required) {
      return 'You must enter a value';
    }
    else if(this.secondFormGroup.controls.confirmPassword.errors.minlength){
        return 'Password must have at least 6 characters';
    }
    else if(this.secondFormGroup.controls.confirmPassword.errors.hasNumber){
        return 'Password must contain at least one number';
    }
    else if(this.secondFormGroup.controls.confirmPassword.errors.hasCapitalCase){
        return 'Password must contain at least one capital letter';
    }
    else if(this.secondFormGroup.controls.confirmPassword.errors.hasSpecialCharacters){
        return 'Password must contain at least one special character';
    }
  }

  getPasswordsMatchErrorMessage(){
    return 'Passwords do not match';
  }

}
