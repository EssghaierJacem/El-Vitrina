import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleCalendarService } from 'src/app/core/services/event/google-calendar.service';

@Component({
  selector: 'app-calendar',
  standalone: true, 
  imports: [FormsModule],
  template: `
    <div class="calendar-container">
      <h2>Google Calendar Integration</h2>
      
      <div class="auth-buttons">
        <button 
          class="sign-in-button" 
          (click)="handleAuthClick()" 
          *ngIf="!isSignedIn">
          <i class="fas fa-sign-in-alt"></i> Sign In
        </button>
        
        <button 
          class="sign-out-button" 
          (click)="handleSignoutClick()" 
          *ngIf="isSignedIn">
          <i class="fas fa-sign-out-alt"></i> Sign Out
        </button>
      </div>
      
      <div class="meet-creation" *ngIf="isSignedIn">
        <h3>Create Google Meet</h3>
        <div class="form-group">
          <label for="title">Meeting Title:</label>
          <input type="text" id="title" [(ngModel)]="meetingTitle">
        </div>
        
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" [(ngModel)]="meetingDescription"></textarea>
        </div>
        
        <button 
          class="create-meet-button" 
          (click)="createMeeting()" 
          [disabled]="isCreatingMeeting">
          <i class="fas fa-video"></i> 
          {{ isCreatingMeeting ? 'Creating...' : 'Create Google Meet' }}
        </button>
        
        <div class="meeting-link" *ngIf="meetingLink">
          <p>Meeting created! Join using this link:</p>
          <a [href]="meetingLink" target="_blank">
            <i class="fas fa-external-link-alt"></i> {{ meetingLink }}
          </a>
        </div>
      </div>
      
      <div class="events-container" *ngIf="isSignedIn">
        <h3>Upcoming Events</h3>
        <button (click)="listUpcomingEvents()" [disabled]="isLoadingEvents">
          <i class="fas fa-sync"></i> 
          {{ isLoadingEvents ? 'Loading...' : 'Refresh Events' }}
        </button>
        
        <div class="events-list" *ngIf="events.length > 0">
          <div class="event-item" *ngFor="let event of events">
            <h4>{{ event.summary }}</h4>
            <p>
              <i class="fas fa-clock"></i> 
              {{ formatDate(event.start.dateTime) }} - {{ formatDate(event.end.dateTime) }}
            </p>
            <a *ngIf="event.hangoutLink" [href]="event.hangoutLink" target="_blank">
              <i class="fas fa-video"></i> Join Meet
            </a>
          </div>
        </div>
        
        <div class="no-events" *ngIf="events.length === 0 && !isLoadingEvents">
          <p>No upcoming events found.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Poppins', sans-serif;
    }
    
    h2 {
      color: #1a73e8;
      margin-bottom: 20px;
    }
    
    .auth-buttons {
      margin-bottom: 20px;
    }
    
    button {
      background-color: #1a73e8;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      margin-right: 10px;
      margin-bottom: 10px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    
    input, textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
    }
    
    textarea {
      height: 100px;
    }
    
    .meeting-link {
      margin-top: 15px;
      padding: 10px;
      background-color: #e8f0fe;
      border-radius: 4px;
    }
    
    .meeting-link a {
      color: #1a73e8;
      word-break: break-all;
    }
    
    .events-container {
      margin-top: 30px;
    }
    
    .events-list {
      margin-top: 15px;
    }
    
    .event-item {
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 10px;
      background-color: #f9f9f9;
    }
    
    .event-item h4 {
      margin: 0 0 10px 0;
      color: #1a73e8;
    }
    
    .event-item a {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: #1a73e8;
      text-decoration: none;
      margin-top: 10px;
    }
    
    .no-events {
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #f9f9f9;
      text-align: center;
      color: #666;
    }
  `]
})
export class CalendarComponent implements OnInit {
  isSignedIn = false;
  isLoadingEvents = false;
  isCreatingMeeting = false;
  events: any[] = [];
  meetingTitle = '';
  meetingDescription = '';
  meetingLink: string | null = null;

  constructor(private calendarService: GoogleCalendarService) {}

  ngOnInit() {
    this.calendarService.initClient().subscribe({
      next: () => {
        console.log('Google API client initialized');
      },
      error: (err) => {
        console.error('Error initializing Google API client', err);
      }
    });
  }

  handleAuthClick() {
    this.calendarService.authenticate().subscribe({
      next: () => {
        this.isSignedIn = true;
        this.listUpcomingEvents();
      },
      error: (err) => {
        console.error('Error during authentication', err);
      }
    });
  }

  handleSignoutClick() {
    this.calendarService.signOut().subscribe({
      next: () => {
        this.isSignedIn = false;
        this.events = [];
        this.meetingLink = null;
      }
    });
  }

  listUpcomingEvents() {
    this.isLoadingEvents = true;
    this.calendarService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.isLoadingEvents = false;
      },
      error: (err) => {
        console.error('Error listing events', err);
        this.isLoadingEvents = false;
      }
    });
  }

  createMeeting() {
    if (!this.meetingTitle) {
      alert('Please enter a meeting title');
      return;
    }

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    this.isCreatingMeeting = true;
    this.calendarService.createMeetEvent(
      this.meetingTitle,
      this.meetingDescription,
      now,
      oneHourLater
    ).subscribe({
      next: (meetLink) => {
        this.meetingLink = meetLink;
        this.isCreatingMeeting = false;
        this.listUpcomingEvents();
      },
      error: (err) => {
        console.error('Error creating meeting', err);
        this.isCreatingMeeting = false;
        alert('Failed to create meeting. Please try again.');
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}