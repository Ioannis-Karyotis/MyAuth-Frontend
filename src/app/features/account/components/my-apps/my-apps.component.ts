import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppConnectedApp } from '@app/shared/models/general';
import { first } from 'rxjs/operators';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-my-apps',
  templateUrl: './my-apps.component.html',
  styleUrls: ['./my-apps.component.less']
})
export class MyAppsComponent implements OnInit {

  connectedApps: AppConnectedApp[];
  displayedColumns: string[] = ['App Name', 'App Base Url' ,'Date Created', 'Options'];
  dataSource : any
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private accountService : AccountService
  ) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails(): void {
    this.accountService.getΜyApps()
    .pipe(first())
    .subscribe({
        next: successResp => {
          this.connectedApps = successResp.data.connectedApps;
          this.dataSource =  new MatTableDataSource<AppConnectedApp>(this.connectedApps);
          this.dataSource.paginator = this.paginator;
        },
        error: error => {
            
        }
    });
  }
}
