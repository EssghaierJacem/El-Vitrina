import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RequestPerso } from 'src/app/core/models/requestPerso/requestPerso.model';
import { ProposalPerso } from 'src/app/core/models/proposalPerso/proposalPerso.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-view-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    // Removed MatDialogRef as it is not a valid import for this array
  ],
  templateUrl: './request-view-dialog.component.html',
  styleUrls: ['./request-view-dialog.component.scss']
})
export class RequestViewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { request: RequestPerso, proposals: ProposalPerso[] }) {}
}
