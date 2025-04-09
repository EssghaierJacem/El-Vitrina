import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { StoreService } from 'src/app/core/services/store/store.service'; 
import { RouterModule } from '@angular/router';
import { Store } from 'src/app/core/models/store/store.model';
import { MatDialog } from '@angular/material/dialog';
import { AppFeedbackDialogComponent } from 'src/app/main-components/appFeedback/frontOffice/app-feedback-dialog/app-feedback-dialog.component';

@Component({
  selector: 'front-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './front-header.component.html',
  styleUrls: ['./front-header.component.scss']
})
export class FrontHeaderComponent implements OnInit {
  firstName = '';
  userId: number | null = null;
  role = '';
  hasStore: boolean = false; 
  storeId: number | null = null;  

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private storeService: StoreService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      const user = this.tokenService.getDecodedToken();
      this.firstName = user?.firstname || 'Guest';
      this.userId = user?.id ?? null;
      this.role = user?.role || '';
      console.log(user);

      if (this.userId) {
        this.storeService.getAll().subscribe((stores) => {
          const userStore = stores.find(store => store.userId === this.userId);
          if (userStore) {
            this.hasStore = true;
            this.storeId = userStore.storeId;  
          }
        });
      }
    }
  }

  logout(): void {
    this.tokenService.logout();
    this.router.navigate(['/authentication/login']);
  }

  goToProfile(): void {
    if (this.userId) {
      this.router.navigate([`/user/${this.userId}/profile`]);
    }
  }

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }

  handleStoreButton(): void {
    if (this.role !== 'SELLER') {
      this.router.navigate(['/user/become-seller']); 
    } else if (this.hasStore) {
      this.router.navigate([`/stores/${this.storeId}`]); 
    } else {
      this.router.navigate(['/stores/create']); 
    }
  }

  openFeedbackDialog(): void {
    const dialogRef = this.dialog.open(AppFeedbackDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result if needed
      }
    });
  }
}
