import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { AiContentService } from 'src/app/core/services/event/aiservice.service';
import { saveAs } from 'file-saver';
import { query } from '@angular/animations';
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
    FormsModule, 
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
  loadingAiContent = false;
  loadingAiImage =false;
  saving = false;
  showAiDialog = false;
aiPromptInput = '';
  calendarEvents: any[] = [];
  googleCalendarEvents: any[] = [];
  showCalendar = true;
  storeId: number;
  eventImage: File;
  userId = this.authService.getUserId();
  role = this.authService.getRole();
  firstName = this.authService.getFirstName();
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
    this.loadPuterScript();
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      eventImage: [''],
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
    
    
    this.virtualEventService.createEvent(eventData, this.eventImage).subscribe(
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
    
      // Update the form to include the actual file
      this.eventImage = file;
  
      // Reset the input to allow selecting the same file again
      input.value = '';
    } else {
      console.log('No file selected');
    }
  }
  
  
//   async onGenerateAIContent(): Promise<void> {
//     this.loading = true;
//  const data = input from html,
    
//     const prompt = await this.askPuter(data);

//   }

  // async onGenerateAIImage(): Promise<void> {
  //   // this.loading = true;
  
  //   // Extract form values
  //   const formValue = this.eventForm.value;
  //   const title = formValue.title || 'Untitled Event';
  //   const description = formValue.description || 'A unique virtual event experience.';
  //   const ticketPrice = formValue.ticketPrice || 0;
  //   const maxParticipants = formValue.maxParticipants || 10;
  //   const startDateTime = formValue.startDateTime
  //     ? new Date(formValue.startDateTime).toLocaleString('en-US', {
  //         month: 'long',
  //         day: 'numeric',
  //         year: 'numeric',
  //         hour: 'numeric',
  //         minute: '2-digit',
  //         hour12: true,
  //       })
  //     : 'TBD';
  
  //   // Construct the query for askPuter
  //   const query = `
  //     Create a professional and detailed prompt for an AI image generation model to produce a web-optimized hero image for a virtual event. The image should have a 16:9 aspect ratio, be visually stunning, and suitable for a website homepage. Use the following event details to craft the prompt:
  
  //     - **Event Title**: "${title}"
  //     - **Description**: "${description}"
  //     - **Ticket Price**: ${ticketPrice === 0 ? 'Free' : `$${ticketPrice}`}
  //     - **Max Participants**: ${maxParticipants}
  //     - **Start Date and Time**: ${startDateTime}
  
  //     The prompt should:
  //     1. Include the event title "${title}" in modern, web-friendly typography.
  //     2. Display event details (date, time, ticket price, and host as "Hosted by ${this.firstName}") in a clean, smaller font.
  //     3. Suggest a subtle "Register Now" button.
  //     4. Incorporate visual elements that reflect the event's theme based on the description, ensuring a clean, digital style with high contrast for web viewing.
  //     5. Avoid overly busy elements and prioritize readability and aesthetic appeal for digital screens.
  //     6. Ensure the design aligns with a professional and beautiful aesthetic, suitable for a website promoting this event.
  
  //     The output should be a concise and professional prompt ready for an AI image generation model to create an accurate and visually appealing image.
  //   `;
  
  //   try {
  //     const aiPrompt = await this.askPuter(query);
  //     console.log('AI-generated prompt:', aiPrompt);
      
  //     this.aiContentService.generateHeroImage(aiPrompt).subscribe({
  //       next: (response) => {
  //         if (response.imageUrl) {
  //           this.selectedImageUrl = response.imageUrl;
  //           this.eventImage = new File([response.blob], response.fileName, { type: response.blob.type });
  //           this.snackBar.open('AI image generated successfully!', 'Close', { duration: 3000 });
  //         } else {
  //           this.snackBar.open('No image generated. Using fallback.', 'Close', { duration: 3000 });
  //         }
  //         this.loading = false;
  //       },
  //       error: (error) => {
  //         console.error('Error generating AI image:', error);
  //         this.snackBar.open('Failed to generate AI image.', 'Close', { duration: 3000 });
  //         this.loading = false;
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error with Puter AI:', error);
  //     this.snackBar.open('Failed to generate AI prompt.', 'Close', { duration: 3000 });
  //     this.loading = false;
  //   }
  // }

  async onGenerateAIImage(): Promise<void> {
    this.loadingAiImage = true;
  
    // Extract form values
    const formValue = this.eventForm.value;
    const title = formValue.title || 'Untitled Event';
    const description = formValue.description || 'A unique virtual event experience.';
    const ticketPrice = formValue.ticketPrice || 0;
    const maxParticipants = formValue.maxParticipants || 10;
    const startDateTime = formValue.startDateTime
      ? new Date(formValue.startDateTime).toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      : 'TBD';
  
    // Construct the query for askPuter
    const query = `
      Create a professional and detailed prompt for an AI image generation model to produce a web-optimized hero image for a virtual event. The image should have a 16:9 aspect ratio, be visually stunning, and suitable for a website homepage. Use the following event details to craft the prompt:
  
      - **Event Title**: "${title}"
      - **Description**: "${description}"
      - **Ticket Price**: ${ticketPrice === 0 ? 'Free' : `$${ticketPrice}`}
      - **Max Participants**: ${maxParticipants}
      - **Start Date and Time**: ${startDateTime}
  
      The prompt should:
      1. Include the event title "${title}" in modern, web-friendly typography.
      2. Display event details (date, time, ticket price, and host as "Hosted by ${this.firstName}") in a clean, smaller font.
      3. Suggest a subtle "Register Now" button.
      4. Incorporate visual elements that reflect the event's theme based on the description, ensuring a clean, digital style with high contrast for web viewing.
      5. Avoid overly busy elements and prioritize readability and aesthetic appeal for digital screens.
      6. Ensure the design aligns with a professional and beautiful aesthetic, suitable for a website promoting this event.
  
      The output should be a concise and professional prompt ready for an AI image generation model to create an accurate and visually appealing image.
    `;
  
    try {
      const aiPrompt = await this.askPuter(query);
      console.log('AI-generated prompt:', aiPrompt);
      
      this.aiContentService.generateHeroImage(aiPrompt).subscribe({
        next: (response) => {
          if (response.imageUrl) {
            this.selectedImageUrl = response.imageUrl;
            this.eventImage = new File([response.blob], response.fileName, { type: response.blob.type });
            this.snackBar.open('AI image generated successfully!', 'Close', { duration: 3000 });
          } else {
            this.snackBar.open('No image generated. Using fallback.', 'Close', { duration: 3000 });
          }
          this.loadingAiImage = false;
        },
        error: (error) => {
          console.error('Error generating AI image:', error);
          this.snackBar.open('Failed to generate AI image.', 'Close', { duration: 3000 });
          this.loadingAiImage = false;
        }
      });
    } catch (error) {
      console.error('Error with Puter AI:', error);
      this.snackBar.open('Failed to generate AI prompt.', 'Close', { duration: 3000 });
      this.loadingAiImage = false;
    }
  }
  
  askPuter(query: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!query.trim()) {
        reject('Please enter a query.');
        return;
      }
  
      if (typeof window['puter'] === 'undefined') {
        reject('Puter.js is not loaded yet.');
        return;
      }
      console.log(window['puter']);
      const puter = window['puter'];
      // const puter = window['puter'];
      // puter.auth.signIn();
      puter.ai
      // .chat(query, { model: 'gpt-4.1' })
        .chat(query, { model: 'claude-3-7-sonnet' })
        .then((res: any) => {
          resolve(res.message.content[0].text);
        })
        .catch((err: any) => {
          console.log('Error:', err);
          console.error('Error:', err);
          reject('An error occurred. Please try again.');
        });
    });
  }


  loadPuterScript(): void {
    const script = document.createElement('script');
    script.src = 'https://js.puter.com/v2/';
    script.async = true;
    script.onload = () => console.log('Puter.js script loaded.');
    script.onerror = () => console.error('Failed to load Puter.js script.');
    document.body.appendChild(script);
    
  }
  // New method for downloading the AI-generated image
  downloadAIImage(): void {
    if (this.eventImage && this.selectedImageUrl) {
      saveAs(this.eventImage, this.eventImage.name);
    }
  }


  
  
  // Add these methods to your component class
  closeAiDialog(): void {
    this.showAiDialog = false;
  }
  
  async generateEventFromPrompt(): Promise<void> {
    if (!this.aiPromptInput.trim()) return;
    
    // Close the dialog
    this.showAiDialog = false;
    
    // Show loading state
    this.loadingAiContent = true;
    
    try {
      // Generate event details using AI
      const detailsPrompt = `
        Based on this user description: "${this.aiPromptInput}"
  
        Generate a full event plan including:
        1. A catchy, professional title for the event (max 60 characters)
        2. A compelling description (2-3 paragraphs, focusing on benefits and experience)
        3. A reasonable ticket price (as a number only, without currency symbol)
        4. A suitable maximum number of participants (as a number only)
  
        Format your response exactly as follows, with each item on a new line:
        TITLE: [generated title]
        DESCRIPTION: [generated description]
        PRICE: [price as number only]
        MAX_PARTICIPANTS: [number only]
      `;
  
      const aiResponse = await this.askPuter(detailsPrompt);
      
      // Parse the AI response
      const titleMatch = aiResponse.match(/TITLE: (.*)/);
      const descriptionMatch = aiResponse.match(/DESCRIPTION: ([\s\S]*?)(?=PRICE:|$)/);
      const priceMatch = aiResponse.match(/PRICE: ([\d\.]+)/);
      const maxParticipantsMatch = aiResponse.match(/MAX_PARTICIPANTS: (\d+)/);
      
      // Update the form with AI-generated content
      if (titleMatch && titleMatch[1]) {
        this.eventForm.patchValue({ title: titleMatch[1].trim() });
      }
      
      if (descriptionMatch && descriptionMatch[1]) {
        this.eventForm.patchValue({ description: descriptionMatch[1].trim() });
      }
      
      if (priceMatch && priceMatch[1]) {
        const price = parseFloat(priceMatch[1]);
        this.eventForm.patchValue({ ticketPrice: price });
      }
      
      if (maxParticipantsMatch && maxParticipantsMatch[1]) {
        const maxParticipants = parseInt(maxParticipantsMatch[1]);
        this.eventForm.patchValue({ maxParticipants: maxParticipants });
      }
      
      // Show success message
      this.snackBar.open('Event details generated! Generating image...', 'Close', { duration: 3000 });
      
      // Call the image generation function after content is generated
      try {
        await this.onGenerateAIImage();
      } catch (error) {
        console.error('Error generating AI image after content:', error);
      } finally {
        this.loadingAiContent = false;
      }
      
    } catch (error) {
      console.error('Error generating AI content:', error);
      this.snackBar.open('Failed to generate event content.', 'Close', { duration: 3000 });
      this.loadingAiContent = false;
    }
  }
  
  onGenerateAIContent(): void {
    // Show the dialog
    this.showAiDialog = true;
    // Reset the input field
    this.aiPromptInput = '';
  }
  
}

