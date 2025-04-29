import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { GoogleApiService } from 'src/app/core/services/event/google-calendar-api.service';
import { GoogleCalendarService } from 'src/app/core/services/event/google-calendar.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';

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
    MatCheckbox

  ]
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() calendarEvents: any[] = [];
  @Input() role: string = 'USER';
  @Output() sessionCreated = new EventEmitter<any>();
  isSignedIn = false;
  events: any[] = [];
  showEventDetails = false;
  showEventDialog = false;
  selectedEvent: any = null;
  eventForm: FormGroup;
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
    private snackBar: MatSnackBar
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
    this.selectedEvent = {
      title: event.title,
      start: event.start,
      end: event.end,
      extendedProps: event.extendedProps
    };
    this.showEventDetails = true;
    arg.el.classList.add('event-clicked');
    this.cdr.detectChanges();
  }

  handleDateClick(info: any) {
    if (this.role === 'SELLER') {
      this.eventForm.reset({
        summary: '',
        start: this.formatDateTime(info.dateStr),
        end: '',
        addMeet: true
      });
      this.showEventDialog = true;
      this.cdr.detectChanges();
    }
  }

  formatDateTime(date: string): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  }

  closeEventDetails(): void {
    this.showEventDetails = false;
    const elements = document.querySelectorAll('.fc-event.event-clicked');
    elements.forEach(el => el.classList.remove('event-clicked'));
    this.selectedEvent = null;
    this.cdr.detectChanges();
  }

  closeEventDialog(): void {
    this.showEventDialog = false;
    this.eventForm.reset();
    this.cdr.detectChanges();
  }

  onSubmitEventForm(): void {
    if (this.eventForm.valid) {
      const eventData = this.eventForm.value;
      this.createMeeting(eventData).then(response => {
        this.sessionCreated.emit({
          title: eventData.summary,
          startDateTime: eventData.start,
          endDateTime: eventData.end,
          hangoutLink: response?.result?.hangoutLink || null
        });
        this.closeEventDialog();
      });
    }
  }

  createMeeting(eventData: any): Promise<any> {
    this.loading = true;
    return this.googleCalendarService.addMeetingEvent(
      eventData.summary,
      eventData.start,
      eventData.end,
      eventData.addMeet
    ).then(response => {
      this.reloadEvents();
      this.loading = false;
      this.cdr.detectChanges();
      return response;
    }).catch(error => {
      this.error = 'Failed to create meeting';
      this.loading = false;
      this.cdr.detectChanges();
      throw error;
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

  addEventToCalendar(event: any): void {
    if (!this.isSignedIn) {
      this.signIn();
      return

;
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
}