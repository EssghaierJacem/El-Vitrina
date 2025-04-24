import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { GoogleApiService } from 'src/app/core/services/event/google-calendar-api.service';
import { GoogleCalendarService } from 'src/app/core/services/event/google-calendar.service';
import { EventDialogComponent } from './event-dialog.component';
import { distinctUntilChanged } from 'rxjs/operators';
import { EventDetailsDialogComponent } from './event-details-dialog.conponent';
import { Observable } from 'rxjs';
import { EventSaissionService } from 'src/app/core/services/event/event-saission.service';
import { EventSessionRequestDTO } from 'src/app/core/models/event/event-session.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './app-calendar.component.html',
  styleUrls: ['./app-calendar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FullCalendarModule,
    MatDialogModule,
    EventDetailsDialogComponent,
    EventDialogComponent,

  ]
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() calendarEvents: any[] = [];
  @Input() role: string = 'USER'; 
  @Input() eventId: number = 0;
  isSignedIn = false;
  events: any[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this),
    editable: true,
    selectable: true,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    eventBackgroundColor: '#1a73e8',
    eventBorderColor: '#1a73e8',
    eventTextColor: '#ffffff'
  };
  loading = false;
  error = '';
  private hasInitialized = false;

  constructor(
    private googleApiService: GoogleApiService,
    private googleCalendarService: GoogleCalendarService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private eventSaissionService: EventSaissionService,
  ) {}

  ngOnInit(): void {
    this.googleApiService.authState$.pipe(
      distinctUntilChanged()
    ).subscribe(isAuthenticated => {
      this.isSignedIn = isAuthenticated;
      if (isAuthenticated) {
        this.loadAllEvents();
      } else {
        this.events = [];
        this.calendarOptions.events = [];
        this.cdr.detectChanges();
        // Attempt sign-in after initialization
        this.initializeGoogleApi();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['calendarEvents'] && 
        changes['calendarEvents'].currentValue &&
        changes['calendarEvents'].currentValue.length > 0) {
      this.loadAllEvents();
    }
  }

  initializeGoogleApi() {
    if (this.hasInitialized) {
      return;
    }

    this.loading = true;
    this.googleApiService.initClient().subscribe({
      next: () => {
        this.hasInitialized = true;
        this.loading = false;
        if (!this.isSignedIn) {
          this.signIn(); // Automatically trigger sign-in if not authenticated
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.error = 'Failed to initialize Google API client';
        // this.snackBar.open(this.error, 'Close', { duration: 3000 });
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  signIn(): void {
    this.loading = true;
    this.error = '';
    this.googleApiService.signIn().subscribe({
      next: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.error = 'Failed to sign in with Google';
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadAllEvents(): void {
    this.loading = true;
    this.error = '';
    this.events = []; // Clear existing events
    console.log('Loading all calendar events...', this.calendarEvents);
    // Create a function that handles pagination internally
    const inputEvents = this.calendarEvents.map(event => ({
      title: event.title,
      start: event.start,
      end: event.end,
      extendedProps: { description: '', hangoutLink: event.streamUrl },
    }));
    
    this.calendarOptions.events = [
      ...inputEvents
    ];
    console.log('Combined events:', this.calendarOptions.events);
    this.loading = false;
    this.cdr.detectChanges();
  
  }
  
  // Method to fetch all events, handling pagination internally
  private fetchAllEvents(): Observable<any[]> {
    return new Observable<any[]>(observer => {
      const allEvents: any[] = [];
      
      // Helper function to recursively fetch all pages
      const fetchPage = (pageToken?: string) => {
        this.googleApiService.listCalendarEvents('primary', 250, pageToken).subscribe({
          next: (response) => {
            if (response.result.items && response.result.items.length > 0) {
              allEvents.push(...response.result.items);
            }
            
            if (response.result.nextPageToken) {
              // Continue to next page
              fetchPage(response.result.nextPageToken);
            } else {
              // All pages loaded, complete the observable
              observer.next(allEvents);
              observer.complete();
            }
          },
          error: (error) => {
            observer.error(error);
          }
        });
      };
      
      // Start fetching from the first page
      fetchPage();
    });
  }



  // handleEventClick(arg: EventClickArg) {
  //   const event = arg.event;
  //   console.log('Event clicked:', event);
  
  //   const dialogRef = this.dialog.open(EventDetailsDialogComponent, {
  //     data: {
  //       title: event.title,
  //       start: event.start,
  //       end: event.end,
  //       hangoutLink: event.extendedProps['hangoutLink']
  //     },
  //     width: '400px'
  //   });
  
  //   // Update data dynamically if needed
  //   setTimeout(() => {
  //     dialogRef.componentInstance.data.title = 'Updated title';
  //   }, 2000);
  // }

// Update this method in your CalendarComponent class
handleEventClick(arg: EventClickArg) {
  const event = arg.event;
  console.log('Event clicked:', event);

  // Get the position of the clicked event for dialog positioning
  const eventEl = arg.el;
  const rect = eventEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Add visual feedback for clicked event
  eventEl.classList.add('event-clicked');
  
  // Open dialog with position data
  const dialogRef = this.dialog.open(EventDetailsDialogComponent, {
    data: {
      title: event.title,
      start: event.start,
      end: event.end,
      hangoutLink: event.extendedProps['hangoutLink'],
      position: { x: centerX, y: centerY }
    },
    width: '400px',
    maxWidth: '90vw',
    backdropClass:'backdrop-bg-orange',
    panelClass: 'event-details-dialog',
    // No position settings here, we'll set it in the component
  });
  
  // Remove highlight when dialog closes
  dialogRef.afterClosed().subscribe(() => {
    eventEl.classList.remove('event-clicked');
  });
}


  handleDateClick(info: any) {
    if( this.role === 'SELLER'){
    const dialogRef = this.dialog.open(EventDialogComponent, {
      data: { date: info.dateStr },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("createing meet");
        console.log(result);
        
        this.createMeeting(result);
        // this.reloadEvents();
      }
    });
  }}
  async reloadEvents() {
    try {
      // Clear existing events first
      this.events = [];
      this.calendarOptions.events = [];
  
      // Fetch fresh data from Google Calendar
      const response = await this.googleCalendarService.listEvents();
      
      if (response?.result?.items) {
        // Process new events
        const googleEvents = response.result.items.map((item: { summary: any; start: { dateTime: any; date: any; }; end: { dateTime: any; date: any; }; description: any; hangoutLink: any; }) => ({
          title: item.summary || 'Untitled Event',
          start: item.start?.dateTime || item.start?.date,
          end: item.end?.dateTime || item.end?.date,
          extendedProps: {
            description: item.description || '',
            hangoutLink: item.hangoutLink 
          },
          source: 'google'
        }));
  
        console.log('Fetched Google Calendar events:', googleEvents);
        
        // Update the calendar with fresh events
        this.calendarOptions.events = [...googleEvents];
        
       this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error reloading events:', error);
      // Handle error (show toast, etc.)
    }
  }
  createMeeting(eventData: any): void {
    this.loading = true;
    this.googleCalendarService.addMeetingEvent(
      eventData.summary,
      eventData.start,
      eventData.end,
      eventData.addMeet
    ).then(response => {
      console.log('Meeting created successfully:', response);
      const event: EventSessionRequestDTO={
        virtualEventId:this.eventId, 
        sessionTitle: response.result.summary,
  startTime: response.result.start.dateTime,
  endTime: response.result.end.dateTime,
  streamUrl: response.result.hangoutLink,
      }
      console.log('Event session data:', event);
      this.eventSaissionService.createEventSession(event).subscribe();
    
      this.reloadEvents();
      this.loading = false;
      this.cdr.detectChanges();

      // this.snackBar.open('Event created successfully', 'Close', { duration: 3000 });
    }).catch(error => {
      console.log('Error creating meeting:', error);
      
      this.error = 'Failed to create meeting';
      // this.snackBar.open(this.error, 'Close', { duration: 3000 });
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  addEventToCalendar(event: any): void {
    if (!this.isSignedIn) {
      this.signIn();
      return;
    }
    this.loading = true;
    this.googleCalendarService.addEventToCalendar({
      summary: event.summary,
      start: { dateTime: event.start },
      end: { dateTime: event.end }
    }).then(() => {
      this.loadAllEvents();
      this.loading = false;
      this.snackBar.open('Event added to calendar', 'Close', { duration: 3000 });
    }).catch(error => {
      this.error = 'Failed to add event to calendar';
      this.snackBar.open(this.error, 'Close', { duration: 3000 });
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  openEventDialog() {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      data: { date: new Date().toISOString().split('T')[0] },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createMeeting(result);
      }
    });
  }
}