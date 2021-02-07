import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { passwordsMatchValidator,passwordPatternValidator } from "@app/_directives/validators"

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    form: FormGroup;
    loading = false;
    hide = true;
    hide2 = true;
    sumbitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            // username: ['', Validators.required],
            name: ['', Validators.required],
            surname: ['', Validators.required],
            email: ['', [Validators.required,Validators.email]],
            password: ['', Validators.compose([
                Validators.required,
                passwordPatternValidator(/\d/, { hasNumber: true }),
                passwordPatternValidator(/[A-Z]/, { hasCapitalCase: true }),
                passwordPatternValidator(/[a-z]/, { hasSmallCase: true }),
                passwordPatternValidator(/[!@#$%^&*(),.?":{}|<>]/,{ hasSpecialCharacters: true }),
                Validators.minLength(6),
            ])
             ],
            confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
        },{validators : passwordsMatchValidator});
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }
    get t() { return this.form }

    onSubmit() {

        this.sumbitted = true;
        
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            setTimeout(() => {
                this.sumbitted = false;
              }, 3000);
            
            return;
        }

        this.loading = true;
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    //ERROR MESSAGES

    // getUsernameErrorMessage(){
    //     if (this.form.controls.username.errors.required) {
    //         return 'You must enter a value';
    //     }
    // }

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