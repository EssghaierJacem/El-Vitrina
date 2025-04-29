import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { RequestPerso } from 'src/app/core/models/requestPerso/requestPerso.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AdminRequestPersoService } from 'src/app/core/services/requestPerso/request-perso-admin.service';
import { ToastrService } from 'ngx-toastr';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

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
    MatDialogModule,
    ConfirmDialogComponent,
    MatProgressBarModule,
    FormsModule,
    LottieComponent 
  ],
  templateUrl: './request-perso-list.component.html',
  styleUrls: ['./request-perso-list.component.scss']
})
export class RequestPersoListComponent {
  allrequests: any[] = [];
  originalRequests: any[] = [];
  userId: number | null = null;
  currentUser: any;
  firstName = '';
  email = '';

  mineRequestsCount = 0;
  othersRequestsCount = 0;
  allRequestsCount = 0;
  filter: 'all' | 'mine' | 'others' = 'all';

  private adminRequestPersoService = inject(AdminRequestPersoService);
  private toastr = inject(ToastrService);

  // Single Lottie animation
  animationOptions: AnimationOptions = {
    path: 'assets/animations_3d/robot.json', 
    loop: true,
    autoplay: true
  };

  currentAnimation: AnimationItem | null = null;

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

  
  animationCreated(animation: AnimationItem): void {
    this.currentAnimation = animation;
    animation.setSpeed(1);
    animation.play();
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
      this.currentUser = { id: this.userId, name: this.firstName, email: this.email };
    }
  }

  getAllRequestPerso(): void {
    this.requestPersoService.getAllRequestPerso().subscribe({
      next: (response) => {
        this.originalRequests = response;
        this.allrequests = [...this.originalRequests];
        this.updateRequestCounts();
        this.applyFilter(this.filter);
      },
      error: () => {
        this.snackBar.open('Error loading requests', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  updateRequestCounts(): void {
    this.allRequestsCount = this.originalRequests.filter(r => r.status === 'ACCEPTED').length;
    this.mineRequestsCount = this.originalRequests.filter(r => r.status === 'ACCEPTED' && r.user?.id === this.userId).length;
    this.othersRequestsCount = this.allRequestsCount - this.mineRequestsCount;
  }

  applyFilter(filterType: 'all' | 'mine' | 'others'): void {
    this.filter = filterType;
    switch (filterType) {
      case 'mine':
        this.allrequests = this.originalRequests.filter(r => r.user?.id === this.userId);
        break;
      case 'others':
        this.allrequests = this.originalRequests.filter(r => r.user?.id !== this.userId);
        break;
      default:
        this.allrequests = [...this.originalRequests];
    }
    this.updateRequestCounts();
  }

  removeRequestFromView(requestId: number): void {
    const card = document.querySelector(`.card-container[data-id="${requestId}"]`);
    if (card) {
      card.classList.add('removing');
      setTimeout(() => {
        this.allrequests = this.allrequests.filter(r => r.id !== requestId);
      }, 300);
    }
  }

  confirmDelete(requestId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      maxHeight: '80vh',
      panelClass: 'custom-dialog',
      autoFocus: false,
      disableClose: true,
      position: { top: '10vh' }
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
        this.originalRequests = this.originalRequests.filter(r => r.id !== requestId);
        this.allrequests = this.allrequests.filter(r => r.id !== requestId);
        this.updateRequestCounts();
        this.snackBar.open('Request deleted successfully', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
      },
      error: () => {
        this.snackBar.open('Failed to delete request', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  getRequestHeat(request: RequestPerso): number {
    const proposalScore = Math.min(request.proposals.length * 10, 50);
    const viewScore = Math.min(request.viewCount, 50);
    return proposalScore + viewScore;
  }

  getHeatLevelClass(request: RequestPerso): string {
    const heat = this.getRequestHeat(request);
    if (heat <= 2) return 'cool';
    if (heat <= 5) return 'warming';
    if (heat <= 10) return 'hot';
    return 'blazing';
  }

  changeStatus(request: RequestPerso, newStatus: string): void {
    if (!confirm(`Are you sure you want to report this request? It will be hidden until the admin reviews it.`)) return;
    const updated = { ...request, status: newStatus };
    this.adminRequestPersoService.updateRequestPerso(request.id!, updated).subscribe({
      next: () => {
        request.status = newStatus;
        this.toastr.success('Status updated');
        this.updateRequestCounts();
      },
      error: () => this.toastr.error('Error updating status')
    });
  }
}
