import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { EventType, EventMode } from 'src/app/core/models/event/virtual-event.model';
import { VirtualEventRequest } from 'src/app/core/models/event/virtual-event.model';
import { VirtualEventService } from 'src/app/core/services/event/virtual-event.service';

@Component({
  selector: 'app-event-register',
  templateUrl: './event-register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./event-register.component.scss']
})
export class EventRegisterComponent implements OnInit {
  eventForm: FormGroup;
  step: number = 1;
  eventTypes = Object.values(EventType); // ONLINE, OFFLINE
  eventModes = Object.values(EventMode); // LIVE, RECORDED

  constructor(
    private fb: FormBuilder,
    private eventService: VirtualEventService
  ) {
    // Set today's date as default in YYYY-MM-DD format
    const today = new Date();
    const formattedToday = this.formatDate(today);

    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDateTime: [formattedToday, Validators.required], // Default to today
      ticketPrice: [null, [Validators.required, Validators.min(0)]],
      eventType: [EventType.FREE_LIVE, Validators.required],
      eventMode: [EventMode.SINGLE_SESSION, Validators.required],
      maxParticipants: [null, [Validators.required, Validators.min(1)]],
      sessions: this.fb.array([])
    });
  }

  ngOnInit(): void {}

  get sessions(): FormArray {
    return this.eventForm.get('sessions') as FormArray;
  }

  getSessionAsFormGroup(index: number): FormGroup {
    return this.sessions.at(index) as FormGroup;
  }

  addSession(): void {
    const today = new Date();
    const formattedToday = this.formatDate(today);
    const sessionGroup = this.fb.group({
      startTime: [formattedToday, Validators.required],
      endTime: ['', Validators.required],
      sessionTitle: ['', Validators.required]
    });
    this.sessions.push(sessionGroup);
  }

  removeSession(index: number): void {
    this.sessions.removeAt(index);
  }

  nextStep(): void {
    if (this.step === 1 && this.isStep1Valid()) {
      this.step = 2;
      if (this.sessions.length === 0) {
        this.addSession();
      }
    }
  }

  previousStep(): void {
    if (this.step === 2) {
      this.step = 1;
    }
  }

  isStep1Valid(): boolean {
    return this.eventForm.controls['title'].valid &&
      this.eventForm.controls['description'].valid &&
      this.eventForm.controls['startDateTime'].valid &&
      this.eventForm.controls['ticketPrice'].valid &&
      this.eventForm.controls['eventType'].valid &&
      this.eventForm.controls['eventMode'].valid &&
      this.eventForm.controls['maxParticipants'].valid;
  }

  submitEvent(): void {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
  
      // Convert startDateTime to a Date object
      const startDateTime = new Date(formValue.startDateTime);
      startDateTime.setHours(0, 0, 0, 0); // Set time to start of day
  
      // Convert session dates to Date objects
      const sessions = formValue.sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime), // Keep as Date object
        endTime: new Date(session.endTime)      // Keep as Date object
      }));
  
      const eventData: VirtualEventRequest = {
        ...formValue,
        startDateTime,
        sessions,
        storeId: 1,
        userId: 1
      };
  
  
      
      const eventDataForBackend = {
        ...eventData,
        sessions: eventData.sessions.map((session: any) => ({
          ...session,
          startTime: session.startTime.toISOString(), 
          endTime: session.endTime.toISOString()      
        }))
      };
  
      console.log('Event Data:', eventDataForBackend);
      // this.eventService.createEvent(eventDataForBackend).subscribe({
      //   next: (response) => console.log('Event created:', response),
      //   error: (err) => console.error('Error creating event:', err)
      // });
    }
  }
  // Format date to YYYY-MM-DD for input type="date"
  private formatDate(date: Date): string {
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
}