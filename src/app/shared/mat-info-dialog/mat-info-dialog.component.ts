import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-mat-info-dialog',
  templateUrl: './mat-info-dialog.component.html',
  styleUrls: ['./mat-info-dialog.component.scss']
})
export class MatInfoDialogComponent  {

  constructor(public dialogRef: MatDialogRef<MatInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  info;


  closeDialog() {
    this.dialogRef.close(false);
  }
}

export interface DialogData {
  text: 'panda' | 'unicorn' | 'lion';
}

