import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

const routes: Routes = [
  {
  path: '',  component: HomeComponent,
  children: [
      { path: '', redirectTo: 'user-details', pathMatch: 'full'},
      { 
        path: 'user-details',
        component: UserDetailsComponent,
      }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
