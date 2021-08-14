import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ExternalLoginAuthTokenReqModel, ExternalLoginReqModel } from '@app/shared/models/requestModels';
import { AlertService, SessionService } from '@app/shared/services';
import { first } from 'rxjs/operators';
import { ExternalAuthService } from '../../services/external-auth.service';
import { ExternalFaceAuthComponent } from '../external-face-auth/external-face-auth.component';

@Component({
  selector: 'app-external-login',
  templateUrl: './external-login.component.html',
  styleUrls: ['./external-login.component.less']
})
export class ExternalLoginComponent implements OnInit {

    form: FormGroup;
    loading = false;
    hide = true;
    response_type: string;
    client_id: string;
    redirect_uri: string;
    scope: string;
    state: string;
    isOpen = true;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private extAuthService: ExternalAuthService,
        private dialog: MatDialog,
        private sessionService: SessionService,
        private alertService: AlertService
    ) {
        
        this.route.queryParams.subscribe(params => {
            this.response_type = params['response_type'];
            this.client_id = params['client_id'];
            this.redirect_uri = params['redirect_uri'];
            this.scope = params['scope'];
            this.state = params['state'];
        });
        if(this.response_type == null || this.client_id == null || this.redirect_uri == null || this.scope == null || this.state == null){
            this.router.navigate(['/accounts/external-auth/oauth/external-login-failure']);
        }
        this.sessionService.isLoggedIn().subscribe(logged => {
            if(logged == true){
                let info = this.sessionService.UserInfo;
                let existingUser = new ExternalLoginAuthTokenReqModel();

                existingUser.authToken = info.userToken;
                existingUser.client_id = this.client_id;
                existingUser.redirect_uri = this.redirect_uri;
                existingUser.scope = this.scope;
                existingUser.response_type = this.response_type;
                existingUser.state = this.state;
                
                this.extAuthService.ExternalAuthTokenSignIn(existingUser)
                .pipe(first())
                .subscribe({
                    next: successAuth => {
                        this.alertService.successAlert('Authentication successful');
                        window.location.replace(`${successAuth.data.client_Url}?code=${successAuth.data.authCode}&state=${successAuth.data.state}`);
                    },
                    error: error => {
                        this.sessionService.logoutExternal();
                    }
                });
            }
        });
    }

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

        let existingUser = new ExternalLoginReqModel();
        existingUser.email = this.f.email.value;
        existingUser.password = this.f.password.value;
        existingUser.client_id = this.client_id;
        existingUser.redirect_uri = this.redirect_uri;
        existingUser.scope = this.scope;
        existingUser.response_type = this.response_type;
        existingUser.state = this.state;
        

        this.extAuthService.ExternalSignIn(existingUser)
            .pipe(first())
            .subscribe({
                next: successLogin => {
                    let dialogRef = this.dialog.open(ExternalFaceAuthComponent, {
                        data: {x_seq : successLogin.data.x_seq},
                        panelClass: 'face-modal'
                    });
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
