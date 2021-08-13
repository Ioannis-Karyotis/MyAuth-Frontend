import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '@app/features/auth/services/auth.service';
import { AlertService } from '@app/shared/services';
import { PasswordPatternValidator,PasswordsMatchValidator } from '@app/shared/directives/validators';
import { FaceAuthComponent } from '@app/shared/components/face-auth/face-auth.component';
import { MatDialog } from '@angular/material/dialog';
import { FaceRegistrationComponent } from '@app/shared/components/face-registration/face-registration.component';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.less'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({transform: 'translateX(+100%)',opacity: 0}),
        animate('500ms ease-in', style({transform: 'translateX(0%)',opacity : 1}))
      ]),
      transition(':leave', [
        style({transform: 'translateY(0%)',opacity: 1}),
        animate('500ms ease-out', style({transform: 'translateY(-100%)',opacity : 0}))
      ]),
    ]),
  ],
})
export class SignUpComponent implements OnInit {

    form: FormGroup;
    loading = false;
    hide = true;
    hide2 = true;
    sumbitted = false;  
    isOpen = true;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private alertService: AlertService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            surname: ['', Validators.required],
            email: ['', [Validators.required,Validators.email]],
            password: ['', Validators.compose([
                Validators.required,
                PasswordPatternValidator(/\d/, { hasNumber: true }),
                PasswordPatternValidator(/[A-Z]/, { hasCapitalCase: true }),
                PasswordPatternValidator(/[a-z]/, { hasSmallCase: true }),
                PasswordPatternValidator(/[!@#$%^&*(),.?":{}|<>]/,{ hasSpecialCharacters: true }),
                Validators.minLength(6),
                ])
            ],
            confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
        },{validators : PasswordsMatchValidator});
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }
    get t() { return this.form }

    onSubmit() {

        this.sumbitted = true;
        this.loading = true;
        // stop here if form is invalid
        if (this.form.invalid) {
            setTimeout(() => {
                this.sumbitted = false;
              }, 3000);
            
            return;
        }
        this.loading = false;
        let dialogRef = this.dialog.open(FaceRegistrationComponent, {
            data: {formData : this.form.value}
        });

    }

    //ERROR MESSAGES
    getNameErrorMessage(){
        if (this.form.controls.name.errors.required) {
            return 'You must enter a value';
        }
    }

    getSurnameErrorMessage(){
        if (this.form.controls.surname.errors.required) {
            return 'You must enter a value';
        }
    }

    getEmailErrorMessage(){
        if (this.form.controls.email.errors.required) {
            return 'You must enter a value';
        }
        else if (this.form.controls.email.errors.email) {
            return 'This is not a valid e-mail';
        }
    }

    getPasswordErrorMessage(){
        if (this.form.controls.password.errors.required) {
            return 'You must enter a value';
        }
        else if(this.form.controls.password.errors.minlength){
            return 'Password must have at least 6 characters';
        }
        else if(this.form.controls.password.errors.hasNumber){
            return 'Password must contain at least one number';
        }
        else if(this.form.controls.password.errors.hasCapitalCase){
            return 'Password must contain at least one capital letter';
        }
        else if(this.form.controls.password.errors.hasSpecialCharacters){
            return 'Password must contain at least one special character';
        }

    }

    getConfirmPasswordErrorMessage(){
        if (this.form.controls.confirmPassword.errors.required) {
            return 'You must enter a value';
        }
        else if(this.form.controls.confirmPassword.errors.minlength){
            return 'Password must have at least 6 characters';
        }
    }
}
