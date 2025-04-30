import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { VirtualEvent, VirtualEventEditRequest, EventType, EventMode } from 'src/app/core/models/event/virtual-event.model';
import { VirtualEventService } from 'src/app/core/services/event/virtual-event.service';
import { EventParticipantService } from 'src/app/core/services/event/event-participant.service';
import { GoogleCalendarService } from 'src/app/core/services/event/google-calendar.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventJoinDialogComponent } from '../event-join/event-join.component';
import { EventParticipantRequest } from 'src/app/core/models/event/event-participant.model';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { CalendarComponent } from './app-calendar.component';
import { MaterialModule } from 'src/app/material.module';
import { MatListModule } from '@angular/material/list';
import { EventDetailsDialogComponent } from './event-details-dialog.conponent';
import { id } from '@swimlane/ngx-charts';
import { SeatBookingComponent } from './seat-booking.component';
import { EventAudioSummaryComponent } from './event-audio.component';

interface EditMode {
  title: boolean;
  description: boolean;
  startDateTime: boolean;
  ticketPrice: boolean;
  maxParticipants: boolean;
  eventType: boolean;
  eventMode: boolean;
  eventImage: boolean;
}

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TablerIconsModule,
    MaterialModule,
    MatListModule,
    CalendarComponent,
    EventJoinDialogComponent,
    EventDetailsDialogComponent,
    SeatBookingComponent,
    EventAudioSummaryComponent,
]
})
export class EventDetailsComponent implements OnInit {
  event: VirtualEvent;
  initEvent: VirtualEvent ;
  editableEvent: VirtualEventEditRequest ;
  eventId: number = 0;
  loading = true;
  calendarEvents: any[] = [];
  googleCalendarEvents: any[] = [];
  showCalendar = false;
  userId: number | null = this.authService.getUserId();
  role: string = this.authService.getRole() || 'USER';
  displayedCalendarEvents: any[] = [];
  googleEventsLoaded = false;
  eventTypes = Object.values(EventType);
  eventModes = Object.values(EventMode);
  editMode: EditMode = {
    title: false,
    description: false,
    startDateTime: false,
    ticketPrice: false,
    maxParticipants: false,
    eventType: false,
    eventMode: false,
    eventImage: false,
  };

  constructor(
    private route: ActivatedRoute,
    private virtualEventService: VirtualEventService,
    private eventParticipantService: EventParticipantService,
    private googleCalendar: GoogleCalendarService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private authService: TokenService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventId = id;
    this.loadData(id);
  }

  loadData(id: number) {
    if (id) {
      this.loading = true;
      this.virtualEventService.getEventById(id).subscribe({
        next: (data: VirtualEvent) => {
          this.event = data;
          this.initEvent = { ...data };
          this.editableEvent = {
            eventId: data.eventId,
            title: data.title,
            description: data.description,
            startDateTime: data.startDateTime,
            ticketPrice: data.ticketPrice,
            eventType: data.eventType,
            eventMode: data.eventMode,
            maxParticipants: data.maxParticipants,
          };
          console.log('Event data:', this.event);

          this.calendarEvents = this.event.sessions.map((session) => ({
            sessionId: session.sessionId,
            title: session.sessionTitle,
            start: new Date(session.startTime).toISOString(),
            end: new Date(session.endTime).toISOString(),
            streamUrl: session.streamUrl,
          }));

          if (this.role === 'SELLER') {
            console.log('User is a seller, loading Google Calendar events');
            this.loadGoogleCalendarEvents();
          } else {
            console.log('User is not a seller, loading local events only');
            this.displayedCalendarEvents = [...this.calendarEvents];
            this.loading = false;
            console.log('Local events loaded:', this.displayedCalendarEvents);
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open('Failed to load event details', 'Close', { duration: 3000 });
        },
      });
    }
  }

  async loadGoogleCalendarEvents() {
    try {
      await this.googleCalendar.initClient();
      const response = await this.googleCalendar.listEvents();
      if (response?.result?.items) {
        this.googleCalendarEvents = response.result.items.map((item: any) => ({
          id: item.id,
          title: item.summary,
          start: item.start?.dateTime || item.start?.date,
          end: item.end?.dateTime || item.end?.date,
          source: 'google',
        }));
        if (this.role === 'SELLER') {
          this.displayedCalendarEvents = [...this.googleCalendarEvents];
          console.log('Google Calendar events loaded:', this.displayedCalendarEvents);
        }
      }
      this.googleEventsLoaded = true;
    } catch (error) {
      console.error('Error loading Google Calendar events:', error);
      this.snackBar.open('Failed to load Google Calendar events', 'Close', { duration: 3000 });
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  setEventSession(): void {
    this.displayedCalendarEvents = [];
    this.virtualEventService.getEventById(this.eventId).subscribe({
      next: (data: VirtualEvent) => {
        this.event = data;
        this.initEvent = { ...data };
        this.editableEvent = {
          eventId: data.eventId,
          title: data.title,
          description: data.description,
          startDateTime: data.startDateTime,
          ticketPrice: data.ticketPrice,
          eventType: data.eventType,
          eventMode: data.eventMode,
          maxParticipants: data.maxParticipants,
        };
        this.calendarEvents = this.event.sessions.map((session) => ({
          sessionId: session.sessionId,
          title: session.sessionTitle,
          start: new Date(session.startTime).toISOString(),
          end: new Date(session.endTime).toISOString(),
          streamUrl: session.streamUrl,
        }));
        this.displayedCalendarEvents = [...this.calendarEvents];
        console.log('Displayed calendar events:', this.displayedCalendarEvents);
        if(this.displayedCalendarEvents.length ==0) {
          this.snackBar.open('No season exists to load the event season.', 'Close', { duration: 3000 });
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Failed to load event details', 'Close', { duration: 3000 });
      },
    });
  }

  hasUserJoined(): boolean {
    if (!this.event?.participants || !this.userId) return false;
    return this.event.participants.some((p) => p.userId === this.userId);
  }

  isUserRole(): boolean {
    return this.role === 'USER';
  }

  joinEvent(): void {
    if (!this.event) {
      console.error('No event data available');
      return;
    }
    const dialogRef = this.dialog.open(EventJoinDialogComponent, {
      width: '400px',
      data: {
        event: this.event,
        maxParticipants: this.event.maxParticipants,
        currentParticipants: this.event.participants?.length || 0,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.tickets) {
        this.loading = true;
        if (this.userId === null) {
          this.snackBar.open('You must be logged in to join the event.', 'Close', { duration: 3000 });
          this.loading = false;
          return;
        }
        const requestdto: EventParticipantRequest = {
          userId: this.userId,
          eventId: this.event.eventId,
          ticketCount: result.tickets,
        };
        this.eventParticipantService.registerParticipant(requestdto).subscribe({
          next: () => {
            this.snackBar.open(`Joined with ${result.tickets} ticket(s)`, 'Close', { duration: 3000 });
            this.loading = false;
            this.loadData(this.event.eventId);
          },
          error: () => {
            this.snackBar.open('Failed to join event', 'Close', { duration: 3000 });
            this.loading = false;
          },
        });
      }
    });
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  getSessionStatus(session: any): 'done' | 'upcoming' {
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

  getImageUrl(filename: string): string {
    return this.virtualEventService.getImageUrl(filename);
  }

 

  resetEditableEvent() {
    if (this.initEvent) {
      this.editableEvent = {
        eventId: this.initEvent.eventId,
        title: this.initEvent.title,
        description: this.initEvent.description,
        startDateTime: this.initEvent.startDateTime,
        ticketPrice: this.initEvent.ticketPrice,
        eventType: this.initEvent.eventType,
        eventMode: this.initEvent.eventMode,
        maxParticipants: this.initEvent.maxParticipants,
      };
    }
  }

  enableEdit(field: keyof EditMode) {
    if (this.role !== 'SELLER') return;
    if (!this.isEditModeActive()) {
      this.resetEditableEvent();
    }
    console.log('Enabling edit mode for field:', field);
    
    this.editMode[field] = true;
    this.cdr.detectChanges();
  }

  isEditModeActive(): boolean {
    return Object.values(this.editMode).some((value) => value);
  }

  cancelEdit() {
    Object.keys(this.editMode).forEach((key) => {
      this.editMode[key as keyof EditMode] = false;
    });
    this.resetEditableEvent();
    this.cdr.detectChanges();
  }

  saveChanges() {
    if (!this.event || !this.editableEvent) return;
    this.loading = true;

    this.virtualEventService.updateEvent(this.event.eventId, this.editableEvent).subscribe({
      next: (updatedEvent: VirtualEvent) => {
        this.event = updatedEvent;
        this.initEvent = { ...updatedEvent };
        this.cancelEdit();
        this.snackBar.open('Event updated successfully', 'Close', { duration: 3000 });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error updating event', error);
        this.snackBar.open('Failed to update event', 'Close', { duration: 3000 });
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.event) {
      const formData = new FormData();
      formData.append('file', file);

      // this.virtualEventService.uploadEventImage(this.event.eventId, formData).subscribe({
      //   next: (response: { imageUrl: string }) => {
      //     if (this.event) {
      //       this.event.eventImage = response.imageUrl;
      //       this.initEvent = { ...this.event };
      //       this.resetEditableEvent();
      //     }
      //     this.editMode.eventImage = false;
      //     this.snackBar.open('Image uploaded successfully', 'Close', { duration: 3000 });
      //     this.cdr.detectChanges();
      //   },
      //   error: (error) => {
      //     console.error('Error uploading image', error);
      //     this.snackBar.open('Failed to upload image', 'Close', { duration: 3000 });
      //   },
      // });
    }
  }
}