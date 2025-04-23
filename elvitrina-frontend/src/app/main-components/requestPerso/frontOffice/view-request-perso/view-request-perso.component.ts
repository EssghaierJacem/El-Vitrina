import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProposalPersoService } from 'src/app/core/services/proposalPerso/proposal-perso.service';
import { RequestPersoService } from 'src/app/core/services/requestPerso/request-perso.service';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component'; 
import { EditProposalDialogComponent } from './edit-proposal-dialog.component';

@Component({
  selector: 'app-view-request-perso',
  imports: [
    RouterModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatChipsModule,
    CommonModule,
    MatGridListModule
  ],
  templateUrl: './view-request-perso.component.html',
  styleUrl: './view-request-perso.component.scss'
})
export class ViewRequestPersoComponent {
  userId: number | null = null;
  currentUser: any;
  firstName = '';
  email = '';
  requestId = this.route.snapshot.params['id'];

  requestData: any;
  ProposalRequests: any;
  proposalForm!: FormGroup;

  constructor(
    private requestPersoService: RequestPersoService,
    private snackBar: MatSnackBar,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private proposalPersoService: ProposalPersoService,
    private dialog: MatDialog,
   
  ) {}

  ngOnInit(): void {
    console.log('Request ID:', this.requestId);

    const token = this.tokenService.getToken();
    if (!token) {
      this.snackBar.open('Please log in to create a store', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/authentication/login']);
    } else {
      this.loadCurrentUser();
    }

    this.proposalForm = this.fb.group({
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  private loadCurrentUser(): void {
    const decodedToken = this.tokenService.getDecodedToken();
    if (decodedToken) {
      this.userId = decodedToken.id ?? null;
      this.firstName = decodedToken.firstname || '';
      this.email = decodedToken.email || '';

      this.currentUser = {
        id: this.userId,
        name: this.firstName,
        email: this.email
      };

      console.log('Current User:', this.currentUser);
    }

    this.getRequestPersoById();
  }

  getProposalRequestsByProposalPerso() {
    console.log('Fetching proposals for request ID:', this.requestId);
    this.proposalPersoService.getAllProposalPersoByRequestPerso(this.requestId).subscribe(
      (response) => {
        this.ProposalRequests = response;
        console.log('ProposalRequests:', this.ProposalRequests);
      },
      (error) => {
        console.error('Error fetching proposal data:', error);
        this.snackBar.open('Error fetching proposal data', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  getRequestPersoById() {
    console.log('Fetching request data for ID:', this.requestId);
    this.requestPersoService.getRequestPersoById(this.requestId).subscribe(
      (response) => {
        this.requestData = response;
        console.log('Request data loaded:', this.requestData);
        this.getProposalRequestsByProposalPerso();
      },
      (error) => {
        console.error('Error fetching request data:', error);
        this.snackBar.open('Error fetching request data', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  createProposal() {
    if (!this.userId) {
      this.snackBar.open('User ID missing. Please re-login.', 'Close', {
        duration: 3000
      });
      return;
    }

    const formValues = this.proposalForm.value;
    const proposalData = {
      requestPersoId: this.requestId,
      userId: this.userId, // ✅ Pass userId to backend
      description: formValues.description,
      price: formValues.price,
      date: new Date().toISOString()
    };

    console.log('Submitting proposal:', proposalData);

    this.proposalPersoService.createNewProposalPerso(proposalData).subscribe(
      (res) => {
        this.snackBar.open('Proposal created successfully!', 'Close', {
          duration: 3000
        });
        this.getProposalRequestsByProposalPerso(); // ✅ Refresh list after creation
      },
      (error) => {
        console.error('Proposal creation error:', error);
        this.snackBar.open('Failed to create proposal. Please try again.', 'Close');
      }
    );
  }

  canDeleteProposal(proposalUserId: number): boolean {
    // Current user is request owner OR proposal owner
    return this.userId === this.requestData.user?.id || this.userId === proposalUserId;
  }
  
  async deleteProposal(proposalId: number): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { 
        title: 'Delete Proposal',
        message: 'Are you sure you want to delete this proposal?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });
  
    const result = await dialogRef.afterClosed().toPromise();
    
    if (result) {
      this.proposalPersoService.deleteProposalPerso(proposalId).subscribe({
        next: () => {
          this.snackBar.open('Proposal deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.getProposalRequestsByProposalPerso(); // Refresh the list
        },
        error: (error) => {
          console.error('Error deleting proposal:', error);
          this.snackBar.open('Failed to delete proposal', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }


  isProposalOwner(proposalUserId: number): boolean {
    return this.userId === proposalUserId;
  }
  
  updateProposal(proposalId: number, updateData: any): void {
    this.proposalPersoService.updateProposalPerso(proposalId, updateData).subscribe({
      next: (updatedProposal) => {
        this.snackBar.open('Proposal updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.getProposalRequestsByProposalPerso(); // Refresh the list
      },
      error: (error) => {
        console.error('Error updating proposal:', error);
        this.snackBar.open('Failed to update proposal', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  
  // Modify your openEditProposalDialog to use the update method
  openEditProposalDialog(proposal: any): void {
    const dialogRef = this.dialog.open(EditProposalDialogComponent, {
      width: '500px',
      data: { proposal }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateProposal(proposal.id, result);
      }
    });
  }


}
