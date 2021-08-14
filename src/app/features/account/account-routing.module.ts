import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnectedAppsComponent } from './components/connected-apps/connected-apps.component';
import { HomeComponent } from './components/home/home.component';
import { MyAppsComponent } from './components/my-apps/my-apps.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

const routes: Routes = [
  {
  path: '',  component: HomeComponent,
  children: [
      { path: '', redirectTo: 'user-details', pathMatch: 'full'},
      { 
        path: 'user-details',
        component: UserDetailsComponent,
      },
      { 
        path: 'connected-apps',
        component: ConnectedAppsComponent,
      },
      { 
        path: 'my-apps',
        component: MyAppsComponent,
      }    
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
