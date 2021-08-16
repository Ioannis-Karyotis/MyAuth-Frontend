import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNewAppComponent } from './components/add-new-app/add-new-app.component';
import { AppDetailsComponent } from './components/app-details/app-details.component';
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
      },   
      { 
        path: 'my-apps/add-new-app',
        component: AddNewAppComponent,
      },    
      { 
        path: 'my-apps/app-details/:id',
        component: AppDetailsComponent
      }    
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
