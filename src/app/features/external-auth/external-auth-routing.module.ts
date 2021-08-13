import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExternalLoginComponent } from './components/external-login/external-login.component';
import { ExternalFaceAuthComponent } from './components/external-face-auth/external-face-auth.component';
import { FailureExternalLoginComponent } from './components/failure-external-login/failure-external-login.component';

const routes: Routes = [
  {
  path: '',
  children: [
      { path : '' ,redirectTo: 'verify-client', pathMatch: 'full'},
      { 
        path: 'verify-client',
        component: ExternalLoginComponent,
      },
      { 
        path: 'external-login-failure',
        component: FailureExternalLoginComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalAuthRoutingModule { }
