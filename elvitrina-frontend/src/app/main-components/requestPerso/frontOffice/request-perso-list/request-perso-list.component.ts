import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RequestPersoService } from 'src/app/core/services/requestPerso/request-perso.service';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  selector: 'app-request-perso-list',
  standalone: true,
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
    MatGridListModule,
    MatDialogModule, // Add this
    ConfirmDialogComponent ,
  ],
  templateUrl: './request-perso-list.component.html',
  styleUrls: ['./request-perso-list.component.scss']
})
export class RequestPersoListComponent {
  allrequests: any[] = [];
  originalRequests: any[] = []; // Stores original data
  userId: number | null = null;
  currentUser: any;
  firstName = '';
  email = '';
  mineRequestsCount = 0;
othersRequestsCount = 0;
allRequestsCount = 0;
  filter: 'all' | 'mine' | 'others' = 'all'; // Default filter
  constructor(
    private requestPersoService: RequestPersoService,
    private snackBar: MatSnackBar,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
     
  ) {}

  ngOnInit(): void {
    this.getAllRequestPerso();
    this.checkAuthentication();
  }

  private checkAuthentication(): void {
    const token = this.tokenService.getToken();
    if (!token) {
      this.snackBar.open('Please log in to view requests', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/authentication/login']);
    } else {
      this.loadCurrentUser();
    }
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
    }
  }

  getAllRequestPerso(): void {
    this.requestPersoService.getAllRequestPerso().subscribe({
      next: (response) => {
        this.originalRequests = response;
        this.allrequests = [...this.originalRequests];
        this.updateRequestCounts(); // Add this line
        this.applyFilter(this.filter);
      },
      error: (error) => {
        console.error('Error fetching requests:', error);
        this.snackBar.open('Error loading requests', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  updateRequestCounts(): void {
    this.allRequestsCount = this.originalRequests.length;
    this.mineRequestsCount = this.originalRequests.filter(r => r.user?.id === this.userId).length;
    this.othersRequestsCount = this.allRequestsCount - this.mineRequestsCount;
  }  
  applyFilter(filterType: 'all' | 'mine' | 'others'): void {
    this.filter = filterType;
    
    switch (filterType) {
      case 'mine':
        this.allrequests = this.originalRequests.filter(request => 
          request.user?.id === this.userId
        );
        break;
      case 'others':
        this.allrequests = this.originalRequests.filter(request => 
          request.user?.id !== this.userId
        );
        break;
      case 'all':
      default:
        this.allrequests = [...this.originalRequests];
        break;
    }
    
    // Update counts whenever filter changes
    this.updateRequestCounts();
  }
  getFilterCount(filterType: 'all' | 'mine' | 'others'): number {
    switch (filterType) {
      case 'mine':
        return this.originalRequests.filter(request => request.user?.id === this.userId).length;
      case 'others':
        return this.originalRequests.filter(request => request.user?.id !== this.userId).length;
      case 'all':
      default:
        return this.originalRequests.length;
    }
  }
  removeRequestFromView(requestId: number): void {
   
    
      // Add 'removing' class to trigger animation
      const card = document.querySelector(`.card-container[data-id="${requestId}"]`);
      if (card) {
        card.classList.add('removing');
        setTimeout(() => {
          this.allrequests = this.allrequests.filter(request => request.id !== requestId);
        }, 300); // Match this with your CSS transition duration
      } 
    
  }

  resetView(): void {
    this.allrequests = [...this.originalRequests];
    this.snackBar.open('All requests restored', 'Close', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }



  confirmDelete(requestId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      maxHeight: '80vh',
      panelClass: 'custom-dialog',
      autoFocus: false,
      disableClose: true,
      position: { 
        top: '10vh' // Positions dialog slightly down from top
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performDelete(requestId);
      }
    });
  }

  private performDelete(requestId: number): void {
    this.requestPersoService.deleteRequestPerso(requestId).subscribe({
      next: () => {
        // Update both originalRequests and filtered requests
        this.originalRequests = this.originalRequests.filter(r => r.id !== requestId);
        this.allrequests = this.allrequests.filter(r => r.id !== requestId);
        this.updateRequestCounts();
        
        this.snackBar.open('Request deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error deleting request:', error);
        this.snackBar.open('Failed to delete request', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  
}