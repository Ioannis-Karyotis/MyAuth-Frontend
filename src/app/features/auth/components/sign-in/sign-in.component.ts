import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '@app/shared/services';
import { MatDialog } from '@angular/material/dialog';
import { LoginReqModel } from '@app/shared/models/requestModels';
import { FaceAuthComponent } from '@app/shared/components/face-auth/face-auth.component';
import { animate, style, transition, trigger } from '@angular/animations';
// import {
//     trigger,
//     state,
//     style,
//     animate,
//     transition
//   } from '@angular/animations';

// import { AccountService, AlertService } from '@app/_services';
// import { LoginReqModel } from '@app/_models/_requestModels';
// import { MatDialog } from '@angular/material/dialog';
// import { FaceAuthComponent } from '@app/_components/face-auth/face-auth.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.less'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({transform: 'translateX(-100%)',opacity: 0}),
        animate('500ms ease-in', style({transform: 'translateX(0%)',opacity : 1}))
      ]),
      transition(':leave', [
        style({transform: 'translateY(0%)',opacity: 1}),
        animate('500ms ease-out', style({transform: 'translateY(-100%)',opacity : 0}))
      ]),
    ]),
  ],
})
export class SignInComponent implements OnInit {

    form: FormGroup;
    loading = false;
    hide = true;
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
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;

        let existingUser = new LoginReqModel();
        existingUser.email = this.f.email.value;
        existingUser.password = this.f.password.value;

        this.authService.SignIn(existingUser)
            .pipe(first())
            .subscribe({
                next: () => {
                    let dialogRef = this.dialog.open(FaceAuthComponent);
                    this.loading = false;
                },
                error: error => {
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
