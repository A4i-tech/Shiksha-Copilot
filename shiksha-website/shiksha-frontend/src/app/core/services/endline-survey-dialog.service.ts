import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EndlineSurveyComponent } from 'src/app/shared/components/endline-survey/endline-survey.component';

@Injectable({ providedIn: 'root' })
export class EndlineSurveyDialogService {
  private dialogRef: any = null;

  constructor(private dialog: MatDialog) {}

  openSurvey(disableClose = true): void {
    if (this.dialogRef) return; // one at a time

    this.dialogRef = this.dialog.open(EndlineSurveyComponent, {
      width: '90%',
      maxWidth: '600px',
      disableClose: disableClose,
      panelClass: 'custom-dialog-container',
      autoFocus: false
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
  }
}
