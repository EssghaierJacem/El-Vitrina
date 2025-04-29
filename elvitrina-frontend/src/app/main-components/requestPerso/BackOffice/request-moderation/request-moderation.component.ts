import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RequestPerso } from 'src/app/core/models/requestPerso/requestPerso.model';
import { AdminRequestPersoService } from 'src/app/core/services/requestPerso/request-perso-admin.service';
import { RequestViewDialogComponent } from 'src/app/main-components/requestPerso/BackOffice/request-view-dialog/request-view-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-moderation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-moderation.component.html',
  styleUrls: ['./request-moderation.component.scss']
})
export class RequestModerationComponent implements OnInit {
  requests: RequestPerso[] = [];
  filteredRequests: RequestPerso[] = [];
  selectedRequests: Set<number> = new Set();
  statusFilter: string = 'ALL';

  private adminRequestPersoService = inject(AdminRequestPersoService);
  private toastr = inject(ToastrService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.adminRequestPersoService.getAllRequestPerso().subscribe({
      next: (data) => {
        this.requests = data;
        this.filteredRequests = data;
      },
      error: () => this.toastr.error('Erreur de chargement des demandes')
    });
  }

  viewRequest(request: RequestPerso): void {
    this.adminRequestPersoService.getProposalsForRequest(request.id!).subscribe({
      next: (proposals) => {
        if (proposals.length === 0) {
          this.toastr.warning('No proposals available for this request.');
        }
        this.dialog.open(RequestViewDialogComponent, {
          width: '600px',
          data: { request, proposals }
        });
      },
      error: () => this.toastr.error('Erreur de chargement des propositions')
    });
  }

  filterRequests(event: any): void {
    this.statusFilter = event.target.value;
    if (this.statusFilter === 'ALL') {
      this.filteredRequests = this.requests;
    } else {
      this.filteredRequests = this.requests.filter(request => request.status === this.statusFilter);
    }
  }

  changeStatus(request: RequestPerso, newStatus: string): void {
    const confirmAction = confirm(`Are you sure you want to change the status to ${newStatus}?`);
    if (!confirmAction) return;

    const updated = { ...request, status: newStatus };
    this.adminRequestPersoService.updateRequestPerso(request.id!, updated).subscribe({
      next: () => {
        request.status = newStatus;
        this.toastr.success('Statut mis à jour');
      },
      error: () => this.toastr.error('Erreur lors de la mise à jour')
    });
  }

  deleteRequest(id: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this request?');
    if (!confirmDelete) return;

    this.adminRequestPersoService.deleteRequestPerso(id).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r.id !== id);
        this.filteredRequests = this.filteredRequests.filter(r => r.id !== id);
        this.selectedRequests.delete(id);
        this.toastr.success('Demande supprimée');
      },
      error: () => this.toastr.error('Erreur de suppression')
    });
  }

  toggleRequestSelection(requestId: number): void {
    if (this.selectedRequests.has(requestId)) {
      this.selectedRequests.delete(requestId);
    } else {
      this.selectedRequests.add(requestId);
    }
  }

  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.filteredRequests.forEach(request => this.selectedRequests.add(request.id));
    } else {
      this.selectedRequests.clear();
    }
  }

  bulkAction(action: string): void {
    const confirmAction = confirm(`Are you sure you want to ${action} the selected requests?`);
    if (!confirmAction) return;

    const updatedRequests = this.requests.filter(request => this.selectedRequests.has(request.id));

    updatedRequests.forEach(request => {
      const updatedRequest = { ...request, status: action };
      this.adminRequestPersoService.updateRequestPerso(request.id!, updatedRequest).subscribe({
        next: () => {
          request.status = action;
        },
        error: () => this.toastr.error('Erreur lors de la mise à jour')
      });
    });

    this.toastr.success(`Requests ${action} successfully`);
  }
}
