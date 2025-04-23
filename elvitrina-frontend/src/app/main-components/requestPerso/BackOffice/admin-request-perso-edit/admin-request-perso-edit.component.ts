import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalPerso } from 'src/app/core/models/proposalPerso/proposalPerso.model';
import { RequestPerso } from 'src/app/core/models/requestPerso/requestPerso.model';
import { AdminProposalPersoService } from 'src/app/core/services/proposalPerso/proposal-perso-admin.service';
import { AdminRequestPersoService } from 'src/app/core/services/requestPerso/request-perso-admin.service';

@Component({
  selector: 'app-admin-request-perso-edit',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule ,
  ],
  templateUrl: './admin-request-perso-edit.component.html',
  styleUrl: './admin-request-perso-edit.component.scss'
})
export class AdminRequestPersoEditComponent implements OnInit {
  request: RequestPerso | undefined;
  requestId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestPersoService: AdminRequestPersoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.requestId = this.route.snapshot.params['id'];
    if (this.requestId) {
      this.loadRequest();
    }
  }

  loadRequest(): void {
    if (this.requestId) {
      this.requestPersoService.getRequestPersoById(this.requestId).subscribe(
        (data) => {
          this.request = data;
        },
        (error) => {
          this.snackBar.open('Failed to load request', 'Close', { duration: 3000 });
        }
      );
    }
  }

  updateRequest(): void {
    if (this.request && this.requestId) {
      this.requestPersoService.updateRequestPerso(this.requestId, this.request).subscribe(
        (updatedRequest) => {
          this.snackBar.open('Request updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/requests']);
        },
        (error) => {
          this.snackBar.open('Failed to update request', 'Close', { duration: 3000 });
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/requests']);
  }
}