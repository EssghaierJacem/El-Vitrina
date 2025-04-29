import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DonationCampaignService } from 'src/app/core/services/donation/donation-campaign.service';
import { CampaignStatusRequestDTO, DonationCampaign } from 'src/app/core/models/donation/donation-campaign.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    MatIconModule,
    TablerIconsModule,
    MaterialModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatCardModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSortModule,
    MatSnackBarModule,
    MatChipsModule,
  ],
  styleUrls: ['./campaign-list.component.scss'],
})
export class CampaignListComponent implements OnInit {
  campaigns: DonationCampaign[] = [];
  loading = true;
  searchText = '';
  displayedColumns: string[] = ['title', 'description', 'goalAmount', 'currentAmount', 'startDate', 'endDate', 'actions'];
  dataSource = new MatTableDataSource<DonationCampaign>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private campaignService: DonationCampaignService,
    private matIconReg: MatIconRegistry,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');
    this.fetchCampaigns();
  }

  fetchCampaigns(): void {
    this.loading = true;
    this.campaignService.getAllCampaigns().subscribe({
      next: (data) => {
        console.log('Fetched campaigns:', data);
        this.campaigns = data;
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching campaigns:', err);
        this.loading = false;
      },
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editCampaign(id: number): void {
    this.router.navigate([`/dashboard/donations/campaigns/${id}`]);
  }

  viewDetails(id: number): void {
    this.router.navigate([`/dashboard/donations/campaigns/${id}`]);
  }

  deleteCampaign(id: number): void {
    if (confirm('Are you sure you want to delete this campaign?')) {
      this.campaignService.deleteCampaign(id).subscribe({
        next: () => {
          this.campaigns = this.campaigns.filter(campaign => campaign.id !== id);
          this.dataSource.data = this.campaigns;
          console.log('Campaign deleted:', id);
        },
        error: (err) => {
          console.error('Error deleting campaign:', err);
        },
      });
    }
  }

  checkCampaign(campaign: DonationCampaign): void {
    const statusRequest: CampaignStatusRequestDTO = {
      status: 'APPROVED',
      verified: true,
    };
    this.campaignService.updateCampaignStatus(campaign.id, statusRequest).subscribe({
      next: (updatedCampaign) => {
        const campaignIndex = this.campaigns.findIndex(c => c.id === campaign.id);
        if (campaignIndex !== -1) {
          this.campaigns[campaignIndex] = updatedCampaign;
          this.dataSource.data = this.campaigns;
        }
        console.log(`Campaign ${campaign.title} status updated to APPROVED and verified`);
      },
      error: (error) => {
        console.error(`Error updating campaign status:`, error);
      },
    });
  }

  formatDate(date: string): string {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  }
}