import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalPerso } from 'src/app/core/models/proposalPerso/proposalPerso.model';
import { AdminProposalPersoService } from 'src/app/core/services/proposalPerso/proposal-perso-admin.service';

@Component({
  selector: 'app-admin-proposal-perso-edit',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './admin-proposal-perso-edit.component.html',
  styleUrl: './admin-proposal-perso-edit.component.scss'
})
export class AdminProposalPersoEditComponent implements OnInit {
  proposal: ProposalPerso | undefined;
  proposalId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private proposalPersoService: AdminProposalPersoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.proposalId = this.route.snapshot.params['id'];
    if (this.proposalId) {
      this.loadProposal();
    }
  }

  loadProposal(): void {
    if (this.proposalId) {
      this.proposalPersoService.getProposalPersoById(this.proposalId).subscribe(
        (data) => {
          this.proposal = data;
        },
        (error) => {
          this.snackBar.open('Failed to load proposal', 'Close', { duration: 3000 });
        }
      );
    }
  }

  updateProposal(): void {
    if (this.proposal && this.proposalId) {
      this.proposalPersoService.updateProposalPerso(this.proposalId, this.proposal).subscribe(
        (updatedProposal) => {
          this.snackBar.open('Proposal updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/proposals']);
        },
        (error) => {
          this.snackBar.open('Failed to update proposal', 'Close', { duration: 3000 });
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/proposals']);
  }}