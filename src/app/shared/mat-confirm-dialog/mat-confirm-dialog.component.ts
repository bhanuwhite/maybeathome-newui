import { Component} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mat-confirm-dialog',
  templateUrl: './mat-confirm-dialog.component.html',
  styleUrls: ['./mat-confirm-dialog.component.scss']
})
export class MatConfirmDialogComponent {

  constructor(public dialogRef: MatDialogRef<MatConfirmDialogComponent>) { }
  closeDialog() {
    this.dialogRef.close(false);
  }

}
