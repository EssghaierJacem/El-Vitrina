import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { ProposalPerso } from 'src/app/core/models/proposalPerso/proposalPerso.model';
import { AdminProposalPersoService } from 'src/app/core/services/proposalPerso/proposal-perso-admin.service';
import { ProposalPersoService } from 'src/app/core/services/proposalPerso/proposal-perso.service';

@Component({
  selector: 'app-admin-proposal-perso-list',
  imports: [CommonModule ,RouterModule], 
  templateUrl: './admin-proposal-perso-list.component.html',
  styleUrl: './admin-proposal-perso-list.component.scss'
})
export class AdminProposalPersoListComponent implements OnInit {
  proposals: ProposalPerso[] = [];

  constructor(
    private proposalPersoService: AdminProposalPersoService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProposals();
  }

  loadProposals(): void {
    this.proposalPersoService.getAllProposalPerso().subscribe(
      (data) => {
        this.proposals = data;
      },
      (error) => {
        this.snackBar.open('Failed to load proposals', 'Close', { duration: 3000 });
      }
    );
  }

  deleteProposal(id: number): void {
    this.proposalPersoService.deleteProposalPerso(id).subscribe(
      () => {
        this.proposals = this.proposals.filter((proposal) => proposal.id !== id);
        this.snackBar.open('Proposal deleted successfully', 'Close', { duration: 3000 });
      },
      (error) => {
        this.snackBar.open('Failed to delete proposal', 'Close', { duration: 3000 });
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/dashboard/RequestPersoe/editproposal']);
  }
}