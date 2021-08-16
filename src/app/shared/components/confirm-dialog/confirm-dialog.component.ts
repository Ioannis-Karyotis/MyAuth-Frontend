import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.less']
})
export class ConfirmDialogComponent{

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) {}

  onReject(): void {
    this.dialogRef.close();
  }

}
