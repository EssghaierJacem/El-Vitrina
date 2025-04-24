import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
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
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { EventSession } from 'src/app/core/models/event/event-session.model';
import { VirtualEvent, VirtualEventRequest } from 'src/app/core/models/event/virtual-event.model';
import { VirtualEventService } from 'src/app/core/services/event/virtual-event.service';
import { EventParticipantService } from 'src/app/core/services/event/event-participant.service';
import { MaterialModule } from 'src/app/material.module';
import { CalendarComponent } from './app-calendar.component';
import { GoogleCalendarService } from 'src/app/core/services/event/google-calendar.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EventJoinDialogComponent } from '../event-join/event-join.component';
import { EventParticipantRequest } from 'src/app/core/models/event/event-participant.model';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { EventDetailsDialogComponent } from './event-details-dialog.conponent';
import { AiContentService } from 'src/app/core/models/event/aiservice.service';

enum EventType {
  FREE_LIVE = 'FREE_LIVE',
  PAID_LIVE = 'PAID_LIVE',
  FREE_RECORDED = 'FREE_RECORDED',
  PAID_RECORDED = 'PAID_RECORDED'
}

enum EventMode {
  SINGLE_SESSION = 'SINGLE_SESSION',
  MULTIPLE_SESSION = 'MULTIPLE_SESSION'
}

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
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
    ReactiveFormsModule,
    MatSortModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDialogModule,
    MatSelectModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    EventJoinDialogComponent,
    EventDetailsDialogComponent
  ],
  standalone: true,
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  selectedImageUrl: string | null = null;
  eventForm: FormGroup;
  event: VirtualEvent;
  loading = true;
  saving = false;
  calendarEvents: any[] = [];
  googleCalendarEvents: any[] = [];
  showCalendar = true;
  storeId: number;
  userId = this.authService.getUserId();
  role = this.authService.getRole();
  displayedCalendarEvents: any[] = [];
  googleEventsLoaded = false;
  eventTypes = Object.values(EventType);
  eventModes = Object.values(EventMode);

  constructor(
    private route: ActivatedRoute,
    private virtualEventService: VirtualEventService,
    private eventParticipantService: EventParticipantService,
    private googleCalendar: GoogleCalendarService,
    private snackBar: MatSnackBar,
    private aiContentService :  AiContentService ,
    private dialog: MatDialog,
    private authService: TokenService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    const today = new Date();
    
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDateTime: [today, Validators.required],
      ticketPrice: [0, [Validators.required, Validators.min(0)]],
      eventType: [EventType.FREE_LIVE, Validators.required],
      eventMode: [EventMode.SINGLE_SESSION, Validators.required],
      maxParticipants: [10, [Validators.required, Validators.min(1)]],
      sessions: this.fb.array([])
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.storeId = id;
    
    if (this.role === 'SELLER') {
      this.loadGoogleCalendarEvents();
    } else {
      this.loading = false;
    }
    
    // Update displayedCalendarEvents whenever sessions change
    this.sessions.valueChanges.subscribe(sessions => {
      this.updateCalendarEvents();
    });
  }

  get sessions(): FormArray {
    return this.eventForm.get('sessions') as FormArray;
  }

  updateCalendarEvents() {
    const sessionEvents = this.sessions.value.map((session: any, index: number) => ({
      id: `session-${index}`,
      title: session.title,
      start: session.startDateTime,
      end: session.endDateTime,
      source: 'session',
      backgroundColor: '#1976d2',
      borderColor: '#1976d2'
    }));

    this.displayedCalendarEvents = [
      ...sessionEvents,
      ...(this.googleCalendarEvents || [])
    ];
  }

  async loadGoogleCalendarEvents() {
    try {
      await this.googleCalendar.initClient();
      
      // Get events from Google Calendar
      const response = await this.googleCalendar.listEvents();
      
      if (response && response.result && response.result.items) {
        this.googleCalendarEvents = response.result.items.map((item: any) => ({
          title: item.summary,
          start: item.start.dateTime || item.start.date,
          end: item.end.dateTime || item.end.date,
          source: 'google',
          backgroundColor: '#757575',
          borderColor: '#757575'
        }));
        
        // Update displayed events
        this.updateCalendarEvents();
      }
      
      this.googleEventsLoaded = true;
    } catch (error) {
      console.error('Error loading Google Calendar events:', error);
      this.snackBar.open('Failed to load Google Calendar events', 'Close', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }



  addSession(sessionData: any) {
    const sessionForm = this.fb.group({
      title: [sessionData.title, Validators.required],
      startDateTime: [sessionData.startDateTime, Validators.required],
      endDateTime: [sessionData.endDateTime, Validators.required],
      description: [sessionData.description || '']
    });
    
    this.sessions.push(sessionForm);
  }

  updateSession(index: number, sessionData: any) {
    const sessionForm = this.sessions.at(index);
    sessionForm.patchValue({
      title: sessionData.title,
      startDateTime: sessionData.startDateTime,
      endDateTime: sessionData.endDateTime,
      description: sessionData.description || ''
    });
  }

  removeSession(index: number) {
    this.sessions.removeAt(index);
  }

  saveEvent() {
    if (this.eventForm.invalid) {
      this.snackBar.open('Please complete all required fields', 'Close', { duration: 3000 });
      return;
    }
    
    this.saving = true;
    const eventData = this.prepareEventData();
    console.log('Event data to be saved:', eventData);
    
    this.virtualEventService.createEvent(eventData).subscribe(
      (response) => {
        this.saving = false;
        this.snackBar.open('Event created successfully', 'Close', { duration: 3000 });
        // Navigate to the created event
        this.router.navigate(['/stores', this.storeId]);
      },
      (error) => {
        this.saving = false;
        console.error('Error creating event:', error);
        this.snackBar.open('Failed to create event', 'Close', { duration: 3000 });
      }
    );
  }

  private prepareEventData(): VirtualEventRequest {
    const formValue = this.eventForm.value;
    
    return {
      title: formValue.title,
      description: formValue.description,
      startDateTime: formValue.startDateTime,
      ticketPrice: formValue.ticketPrice,
      eventType: formValue.eventType,
      eventMode: formValue.eventMode,
      maxParticipants: formValue.maxParticipants,
      sessions: formValue.sessions,
      storeId: this.storeId,
      userId: this.userId,
    } as VirtualEventRequest;
  }

  onSessionCreated(sessionData: any) {
    // Create a new session form group
    const sessionForm = this.fb.group({
      sessionTitle: [sessionData.title, Validators.required],
      startTime: [sessionData.startDateTime, Validators.required],
      endTime: [sessionData.endDateTime, Validators.required],
      streamUrl: [sessionData.hangoutLink || '']
    });
    
    // Add the session to the form array
    this.sessions.push(sessionForm);
    
    // Show confirmation message
    this.snackBar.open('Session added successfully!', 'Close', { duration: 3000 });
  }

  onUploadImage(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    } else {
      console.error('File input not found');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      console.log('Selected image:', file);
      // Create a URL for the selected image to display it (optional)
      this.selectedImageUrl = URL.createObjectURL(file);
      console.log('Image URL:', this.selectedImageUrl);
      // Optionally store the file or URL in the form
      this.eventForm.patchValue({ imageUrl: this.selectedImageUrl });
      // Reset the input to allow selecting the same file again
      input.value = '';
    } else {
      console.log('No file selected');
    }
  }
  
  onGenerateAIContent(): void {
    this.loading = true;

    const prompt = 'Generate details for a cooking event, including title, description, start date and time, and end date and time.';
    
    this.aiContentService.generateEventContent(prompt).subscribe({
      next: (response : any) => {
        // Update form controls with AI-generated content
        this.eventForm.patchValue({
          title: response.title,
          description: response.description,
          startDateTime: response.startDateTime ? new Date(response.startDateTime) : null
          // Note: endDateTime is not in the form but could be emitted to calendar
        });

        // Optionally emit session details to calendar
        // if (response.startDateTime && response.endDateTime) {
        //   this.sessionCreated.emit({
        //     title: response.title,
        //     start: new Date(response.startDateTime),
        //     end: new Date(response.endDateTime)
        //   });
        // }

        this.snackBar.open('Event details updated with AI content!', 'Close', { duration: 3000 });
        this.loading = false;
      },
      error: (error :any) => {
        console.error('Error generating AI content:', error);
        this.snackBar.open('Failed to generate AI content. Using fallback data.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
  
}

