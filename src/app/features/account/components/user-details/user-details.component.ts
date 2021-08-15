import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from './../../services/account.service';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.less']
})
export class UserDetailsComponent implements OnInit {
  email: any;
  firstName: any;
  lastName: any;

  constructor(
    private accountService : AccountService
  ) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails(): void {
    this.accountService.getUserDetails()
    .pipe(first())
    .subscribe({
        next: successResp => {
            this.email = successResp.data.email;
            this.firstName = successResp.data.firstName;
            this.lastName = successResp.data.lastName;
        },
        error: error => {
            
        }
    });
  }

}
