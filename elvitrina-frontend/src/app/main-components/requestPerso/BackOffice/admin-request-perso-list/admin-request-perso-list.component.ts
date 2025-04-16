import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { RequestPerso } from 'src/app/core/models/requestPerso/requestPerso.model';
import { AdminRequestPersoService } from 'src/app/core/services/requestPerso/request-perso-admin.service';
import { RequestPersoService } from 'src/app/core/services/requestPerso/request-perso.service';

@Component({
  selector: 'app-admin-request-perso-list',
  imports: [CommonModule , RouterModule , ],
  templateUrl: './admin-request-perso-list.component.html',
  styleUrl: './admin-request-perso-list.component.scss'
})
export class AdminRequestPersoListComponent implements OnInit {
  requests: RequestPerso[] = [];

  constructor(
    private requestPersoService: AdminRequestPersoService,
    private snackBar: MatSnackBar,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.requestPersoService.getAllRequestPerso().subscribe(
      (data) => {
        this.requests = data;
      },
      (error) => {
        this.snackBar.open('Failed to load requests', 'Close', { duration: 3000 });
      }
    );
  }

  deleteRequest(id: number): void {
    this.requestPersoService.deleteRequestPerso(id).subscribe(
      () => {
        this.requests = this.requests.filter((request) => request.id !== id);
        this.snackBar.open('Request deleted successfully', 'Close', { duration: 3000 });
      },
      (error) => {
        this.snackBar.open('Failed to delete request', 'Close', { duration: 3000 });
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/admin/requests']);
  }
}