import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EndlineSurveyComponent } from 'src/app/shared/components/endline-survey/endline-survey.component';

@Injectable({ providedIn: 'root' })
export class EndlineSurveyDialogService {
  private ref?: MatDialogRef<EndlineSurveyComponent>;
  constructor(private dialog: MatDialog) {}
  open() {
    if (this.ref) return;
    this.ref = this.dialog.open(EndlineSurveyComponent, { width: '90%', maxWidth: '600px', disableClose: true, autoFocus: false });
    this.ref.afterClosed().subscribe(() => this.ref = undefined);
  }
}
