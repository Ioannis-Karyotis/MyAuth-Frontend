import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';

import { AccountService, AlertService } from '@app/_services';
import { LoginReqModel } from '@app/_models/_requestModels';
import { MatDialog } from '@angular/material/dialog';
import { FaceAuthComponent } from '@app/_components/face-auth/face-auth.component';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    hide = true;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;

        let existingUser = new LoginReqModel();
        existingUser.email = this.f.email.value;
        existingUser.password = this.f.password.value;

        this.accountService.login(existingUser)
            .pipe(first())
            .subscribe({
                next: () => {
                    let dialogRef = this.dialog.open(FaceAuthComponent);
                    this.loading = false;
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    //ERROR MESSAGES
    getEmailErrorMessage(){
        if (this.form.controls.email.errors.required) {
            return 'You must enter a value';
        }
    }

    getPasswordErrorMessage(){
        if (this.form.controls.password.errors.required) {
            return 'You must enter a value';
        }
    }
}