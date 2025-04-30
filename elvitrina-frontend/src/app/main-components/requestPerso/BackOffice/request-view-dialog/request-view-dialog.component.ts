import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { RequestPerso } from 'src/app/core/models/requestPerso/requestPerso.model';
import { ProposalPerso } from 'src/app/core/models/proposalPerso/proposalPerso.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-view-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './request-view-dialog.component.html',
  styleUrls: ['./request-view-dialog.component.scss']
})
export class RequestViewDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { request: RequestPerso, proposals: ProposalPerso[] },
    private dialogRef: MatDialogRef<RequestViewDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
