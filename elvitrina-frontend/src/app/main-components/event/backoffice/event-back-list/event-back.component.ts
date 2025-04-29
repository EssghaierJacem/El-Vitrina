import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { VirtualEventService } from 'src/app/core/services/event/virtual-event.service';
import { VirtualEvent } from 'src/app/core/models/event/virtual-event.model';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-event-back',
  templateUrl: './event-back.component.html',
  styleUrls: ['./event-back.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TablerIconsModule,
    MaterialModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSortModule,
    FormsModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDialogModule,
    MatSelectModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class EventBackListComponent implements OnInit {
  events: VirtualEvent[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchText: string = '';

  displayedColumns: string[] = ['id', 'title', 'description', 'maxParticipants', 'startDateTime', 'actions'];
  dataSource = new MatTableDataSource<VirtualEvent>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private eventService: VirtualEventService, private router: Router) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.loading = true;
    this.eventService.getAllEvents().subscribe({
      next: (data: VirtualEvent[]) => {
        console.log('Fetched events:', data);
        this.events = data;
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
        if (data.length === 0) {
          this.error = 'No events found.';
        }
      },
      error: (err: any) => {
        console.error('Error fetching events:', err);
        this.error = 'Failed to load events. Please try again later.';
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

  goToEvent(eventId: number): void {
    console.log('Navigating to event ID:', eventId);
    this.router.navigate(['/events', eventId]);
  }

  deleteEvent(eventId: number): void {
    console.log('Deleting event ID:', eventId);
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          this.events = this.events.filter(event => event.eventId !== eventId);
          this.dataSource.data = this.events;
          console.log('Event deleted:', eventId);
        },
        error: (err) => {
          console.error('Error deleting event:', err);
          this.error = 'Failed to delete event.';
        },
      });
    }
  }

  formatDate(date: Date | string): string {
    const eventDate = typeof date === 'string' ? new Date(date) : date;
    return eventDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  }

  exportToExcel(): void {
    console.log('Exporting events to Excel...');
    // Implement export logic (e.g., using a library like XLSX)
  }
}