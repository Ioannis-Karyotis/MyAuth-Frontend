import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private _snackBar : MatSnackBar) {
        
  }

  errorAlert(message : string){
      this._snackBar.open(message, 'OK', {
          duration: 3000,
          panelClass: ['failure-snackbar']
      });
  }

  successAlert(message : string){
      this._snackBar.open(message, 'OK', {
          duration: 3000
      });
  }
}
