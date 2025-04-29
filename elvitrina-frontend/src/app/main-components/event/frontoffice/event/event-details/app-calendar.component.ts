import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { GoogleApiService } from 'src/app/core/services/event/google-calendar-api.service';
import { GoogleCalendarService } from 'src/app/core/services/event/google-calendar.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { EventSaissionService } from 'src/app/core/services/event/event-saission.service';
import { EventSessionEditRequestDTO, EventSessionRequestDTO } from 'src/app/core/models/event/event-session.model';
import { MatDialogActions, MatDialogContent, MatDialogModule } from '@angular/material/dialog';

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
    MatCheckboxModule,
    FullCalendarModule,
    MatCheckbox,
    MatDialogContent,
    MatDialogActions,
    MatDialogModule,
  ]
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() calendarEvents: any[] = [];
  @Input() role: string = 'USER';
  @Input() eventId: number = 0;
  isSignedIn = false;
  events: any[] = [];
  animationState: 'opening' | 'open' | null = null;
  showEventDetails = false;
  showEventDialog = false;
  selectedEvent: any = null;
  titleSession: string = '';
  deletesaisionID: number = 0;
  eventForm: FormGroup;
  editevent:EventSessionEditRequestDTO;
  dialogPosition: { [key: string]: string } = { '--top': '20px', '--left': '20px' };
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
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private eventSaissionService: EventSaissionService
  ) {
    this.eventForm = this.fb.group({
      summary: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      addMeet: [true]
    });
  }

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
  joinMeet(meetLink: string): void {
    if (meetLink) {
      window.open(meetLink, '_blank');
    } else {
      this.snackBar.open('No meeting link available', 'Close', { duration: 3000 });
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
          this.signIn();
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.error = 'Failed to initialize Google API client';
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
    this.events = [];
    const inputEvents = this.calendarEvents.map(event => ({
      title: event.title,
      start: event.start,
      end: event.end,
      extendedProps: { description: '', hangoutLink: event.streamUrl },
    }));
    
    this.calendarOptions.events = [...inputEvents];
    this.loading = false;
    this.cdr.detectChanges();
  }

 


  handleEventClick(arg: EventClickArg) {
    const event = arg.event;
    
    // Get click coordinates relative to viewport
    const clickX = arg.jsEvent.clientX;
    const clickY = arg.jsEvent.clientY;
    
    // Adjust for viewport boundaries
    const adjusted = this.adjustPositionForViewport(clickY, clickX);
    
    this.dialogPosition = {
      '--top': `${adjusted.top}px`,
      '--left': `${adjusted.left}px`
    };
    
    this.selectedEvent = {
      title: event.title,
      start: event.start,
      end: event.end,
      extendedProps: event.extendedProps
    };

   this.titleSession = this.selectedEvent.title;
   

        this.editevent={
      sessionId: this.selectedEvent.sessionId,
      startTime: this.selectedEvent.start,
      endTime: this.selectedEvent.end,
      sessionTitle: this.selectedEvent.title,
      streamUrl: this.selectedEvent.extendedProps.hangoutLink
    };  
    
    this.showEventDetails = true;
    this.animationState = 'opening';
    
    setTimeout(() => {
      this.animationState = 'open';
      this.cdr.detectChanges();
    }, 50);
  }
  
  handleDateClick(info: any) {
    if (this.role === 'SELLER') {
      // Get click coordinates relative to viewport
      const clickX = info.jsEvent.clientX;
      const clickY = info.jsEvent.clientY;
      
      // Adjust for viewport boundaries
      const adjusted = this.adjustPositionForViewport(clickY, clickX);
      
      this.dialogPosition = {
        '--top': `${adjusted.top}px`,
        '--left': `${adjusted.left}px`
      };
      
      this.eventForm.reset({
        summary: '',
        start: this.formatDateTime(info.dateStr),
        end: '',
        addMeet: true
      });
      
      this.showEventDialog = true;
      this.animationState = 'opening';
      
      setTimeout(() => {
        this.animationState = 'open';
        this.cdr.detectChanges();
      }, 50);
    }
  }
  
  private adjustPositionForViewport(top: number, left: number, width: number = 400, height: number = 300) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust if right edge would go off screen
    if (left + width > viewportWidth) {
      left = Math.max(10, viewportWidth - width - 20);
    }
    
    // Adjust if bottom edge would go off screen
    if (top + height > viewportHeight) {
      top = Math.max(10, viewportHeight - height - 20);
    }
    
    // Ensure minimum values
    return {
      top: Math.max(10, top),
      left: Math.max(10, left)
    };
  }
  
  openEventDialog() {
    const calendarElement = document.querySelector('.calendar-wrapper');
    if (calendarElement) {
      const rect = calendarElement.getBoundingClientRect();
      // Use client coordinates instead of page coordinates
      const top = rect.top + 20;
      const left = rect.left + 20;
      this.dialogPosition = {
        '--top': `${top}px`,
        '--left': `${left}px`
      };
    }
    this.eventForm.reset({
      summary: '',
      start: this.formatDateTime(new Date().toISOString()),
      end: '',
      addMeet: true
    });
    this.showEventDialog = true;
    this.animationState = 'opening';
    setTimeout(() => {
      this.animationState = 'open';
      this.cdr.detectChanges();
    }, 50);
    this.cdr.detectChanges();
  }

  formatDateTime(date: string): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  }

  closeOnBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.event-details-container') && !target.closest('.event-dialog-container')) {
      if (this.showEventDetails) {
        this.closeEventDetails();
      }
      if (this.showEventDialog) {
        this.closeEventDialog();
      }
    }
  }

  closeEventDetails(): void {
    this.showEventDetails = false;
    this.animationState = null;
    const elements = document.querySelectorAll('.fc-event.event-clicked');
    elements.forEach(el => el.classList.remove('event-clicked'));
    this.selectedEvent = null;
    this.cdr.detectChanges();
  }

  closeEventDialog(): void {
    this.showEventDialog = false;
    this.animationState = null;
    this.eventForm.reset();
    this.cdr.detectChanges();
  }

  onSubmitEventForm(): void {
    if (this.eventForm.valid) {
      const eventData = this.eventForm.value;
      this.createMeeting(eventData);
      this.closeEventDialog();
    }
  }

  createMeeting(eventData: any): void {
    this.loading = true;
    console.log('Creating meeting with data:', eventData);
    this.googleCalendarService.addMeetingEvent(
      eventData.summary,
      eventData.start,
      eventData.end,
      eventData.addMeet
    ).then(response => {
      console.log('Meeting created successfully:', response);
      const event: EventSessionRequestDTO = {
        virtualEventId: this.eventId,
        sessionTitle: response.result.summary,
        startTime: response.result.start.dateTime,
        endTime: response.result.end.dateTime,
        streamUrl: response.result.hangoutLink
      };
      console.log('Event session data:', event);
      this.eventSaissionService.createEventSession(event).subscribe();
      this.reloadEvents();
      this.loading = false;
      this.cdr.detectChanges();
    }).catch(error => {
      console.log('Error creating meeting:', error);
      this.error = 'Failed to create meeting';
      this.loading = false;
      this.cdr.detectChanges();
    });
  }
  

  async reloadEvents() {
    try {
      this.events = [];
      this.calendarOptions.events = [];
      const response = await this.googleCalendarService.listEvents();
      
      if (response?.result?.items) {
        const googleEvents = response.result.items.map((item: any) => ({
          title: item.summary || 'Untitled Event',
          start: item.start?.dateTime || item.start?.date,
          end: item.end?.dateTime || item.end?.date,
          extendedProps: {
            description: item.description || '',
            hangoutLink: item.hangoutLink
          },
          source: 'google'
        }));
        this.calendarOptions.events = [...googleEvents];
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error reloading events:', error);
    }
  }

 
  editEventDetails(){
console.log(this.editevent);

this.eventSaissionService.updateEventSession(this.editevent.sessionId, this.editevent).subscribe({
  next: () => {
    this.snackBar.open('Session updated successfully', 'Close', { duration: 3000 });
    this.reloadEvents();
    this.loading = false;
  },
  error: (err) => {
    this.snackBar.open('Failed to update session', 'Close', { duration: 3000 });
    this.loading = false;
  }
});
  }


  deleteEventDetails(){   
    this.eventSaissionService.deleteEventSession(this.eventId ,this.titleSession ).subscribe({
      next: () => {
        this.snackBar.open('Session deleted successfully', 'Close', { duration: 3000 });
        this.reloadEvents();
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to delete session', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

}