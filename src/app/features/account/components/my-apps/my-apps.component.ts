import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { AppConnectedApp } from '@app/shared/models/general';
import { AlertService } from '@app/shared/services';
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
    private accountService : AccountService,
    private alertService : AlertService,
    private dialog : MatDialog,
  ) { }

  ngOnInit(): void {
    this.getMyApps();
  }

  getMyApps(): void {
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

  deleteAction(id:string){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'Yes'){
        this.accountService.deleteApp(id)
        .pipe(first())
        .subscribe({
            next: successResp => {
              this.alertService.successAlert("App deleted successfully");
              this.getMyApps();
            },
            error: error => {
                
            }
        });
      }
    })  
  }
}
