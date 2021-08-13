import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard,LoginGuard } from '@app/shared/helpers/guards';

const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule ), canActivate:[LoginGuard] },
    { path: 'account', loadChildren: () => import('./features/account/account.module').then(m => m.AccountModule ), canActivate:[AuthGuard]},
    { path: 'accounts/external-auth/oauth', loadChildren: () => import('./features/external-auth/external-auth.module').then(m => m.ExternalAuthModule ) },
    // otherwise redirect to home
    { path: '**', redirectTo: 'auth' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }