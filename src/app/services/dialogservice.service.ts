import { MatInfoDialogComponent } from './../shared/mat-info-dialog/mat-info-dialog.component';
import { MatConfirmDialogComponent } from './../shared/mat-confirm-dialog/mat-confirm-dialog.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class Dialogservice {

  constructor(private dialog: MatDialog) { }


  openConfirmDialog() {
    return this.dialog.open(MatConfirmDialogComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true
    });
  }


  openDialog(textmsg) {
    this.dialog.open(MatInfoDialogComponent, {
      data: {
        text: textmsg
      },
      width: '390px',
    });
  }



}
