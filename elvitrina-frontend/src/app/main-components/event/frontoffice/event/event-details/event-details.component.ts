import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { EventSession } from 'src/app/core/models/event/event-session.model';
import { VirtualEvent } from 'src/app/core/models/event/virtual-event.model';
import { VirtualEventService } from 'src/app/core/services/event/virtual-event.service';
import { EventParticipantService } from 'src/app/core/services/event/event-participant.service';
import { MaterialModule } from 'src/app/material.module';
import { CalendarComponent } from './app-calendar.component';
import { GoogleCalendarService } from 'src/app/core/services/event/google-calendar.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventJoinDialogComponent } from '../event-join/event-join.component';
import { EventParticipantRequest } from 'src/app/core/models/event/event-participant.model';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  imports: [
    CalendarComponent,
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
    FormsModule,
    MatSortModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDialogModule,
    EventJoinDialogComponent
  ],
  standalone: true,
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: VirtualEvent;
  loading = true;
  calendarEvents: any[] = [];
  googleCalendarEvents: any[] = [];
  showCalendar = false;
  role = 'user'; // You might want to inject this from an auth service
  displayedCalendarEvents: any[] = [];
  googleEventsLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private virtualEventService: VirtualEventService,
    private EventParticipantService: EventParticipantService,

    private googleCalendar: GoogleCalendarService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog

  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loading = true;
      this.virtualEventService.getEventById(id).subscribe({
        next: (data) => {
          this.event = data;
          console.log('Event data:', this.event);
          
          console.log('Event data:', this.event.sessions[0]);
          
          // Format sessions for calendar integration
          this.calendarEvents = this.event.sessions.map(session => ({
            title: session.sessionTitle,
            start: new Date(session.startTime).toISOString(),
            end: new Date(session.endTime).toISOString()
          }));

          // Set initial displayed events
          
          // If user is a seller, load Google Calendar events
          if (this.role === 'seller') {
            console.log('User is a seller, loading Google Calendar events');
            
            this.loadGoogleCalendarEvents();
          } else {
            console.log('User is not a seller, loading local events only');
            this.displayedCalendarEvents = [...this.calendarEvents];
            this.loading = false;
            console.log('Local events loaded:', this.displayedCalendarEvents);
            
          }
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open('Failed to load event details', 'Close', { duration: 3000 });
        }
      });
    }
  }

  async loadGoogleCalendarEvents() {
    try {
      await this.googleCalendar.initClient();
      
      // Get events from Google Calendar
      const response = await this.googleCalendar.listEvents();
      
      if (response && response.result && response.result.items) {
        this.googleCalendarEvents = response.result.items.map((item: { summary: any; start: { dateTime: any; date: any; }; end: { dateTime: any; date: any; }; }) => ({
          title: item.summary,
          start: item.start.dateTime || item.start.date,
          end: item.end.dateTime || item.end.date,
          source: 'google'
        }));
        
        // Combine Google events with the current event sessions
     
        if (this.role === 'seller') {
          console.log('User is a seller, loading Google Calendar events');
          
          this.displayedCalendarEvents = [
            
            ...this.googleCalendarEvents
          ];
          console.log('Google Calendar events loaded:', this.displayedCalendarEvents);
          
        }
      }
      
      this.googleEventsLoaded = true;
    } catch (error) {
      console.error('Error loading Google Calendar events:', error);
      this.snackBar.open('Failed to load Google Calendar events', 'Close', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  
  joinEvent(): void {
    if (!this.event) {
      console.error('No event data available');
      return;
    }
  
    console.log('Opening join dialog for event:', this.event.eventId);
  
    const dialogRef = this.dialog.open(EventJoinDialogComponent, {
      width: '400px',
      data: {
        event: this.event,
        maxParticipants: this.event.maxParticipants,
        currentParticipants: this.event.participants?.length || 0
      }
    });
  
    dialogRef.afterOpened().subscribe(() => {
      console.log('Dialog opened successfully');
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      if (result?.tickets) {
        this.loading = true;
        const requestdto: EventParticipantRequest ={
          userId: 1, // Replace with actual user ID from auth service
          eventId: this.event.eventId,
          ticketCount: result.tickets,
        }
        this.EventParticipantService.registerParticipant(requestdto).subscribe({
          next: () => {
            this.snackBar.open(`Joined with ${result.tickets} ticket(s)`, 'Close', { duration: 3000 });
            this.loading = false;
          },
          error: () => {
            this.snackBar.open('Failed to join event', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  getSessionStatus(session: EventSession): 'done' | 'upcoming' {
    const now = new Date();
    const end = new Date(session.endTime);
    return now > end ? 'done' : 'upcoming';
  }
 
  getTimelineCardClass(status: string) {
    return status === 'done' ? 'timeline-card-done' : 'timeline-card-upcoming';
  }
  
  getTimelineDotClass(status: string) {
    return status === 'done' ? 'timeline-dot-done' : 'timeline-dot-upcoming';
  }
  
  getTimelineLineClass(status: string) {
    return status === 'done' ? 'timeline-connector-done' : 'timeline-connector-upcoming';
  }
}