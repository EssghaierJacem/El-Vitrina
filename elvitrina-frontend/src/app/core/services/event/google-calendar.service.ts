// google-calendar.service.ts
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GoogleApiService } from './google-calendar-api.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  constructor(private googleApiService: GoogleApiService) {}

  initClient(): Promise<void> {
    return this.googleApiService.initClient().toPromise();
  }

  async addEventToCalendar(event: any): Promise<any> {
    try {
      const response = await this.googleApiService.createCalendarEvent(event).toPromise();
      return response;
    } catch (error) {
      console.error('Error adding event to calendar', error);
      throw error;
    }
  }

  async addMeetingEvent(summary: string, start: Date, end: Date, addMeet: boolean = true): Promise<any> {
    try {
      const response = await this.googleApiService.createMeetingEvent(
        summary, start, end, addMeet
      ).toPromise();
      return response;
    } catch (error) {
      console.error('Error creating meeting event', error);
      throw error;
    }
  }

  async listEvents(timeMin?: Date, timeMax?: Date, maxResults = 250): Promise<any> {
    try {
      // Initialize the client if not already done
      await this.initClient();
      
      // Use the existing method without passing specific timeMin/timeMax parameters
      // The GoogleApiService.listCalendarEvents method already has defaults
      const response = await this.googleApiService.listCalendarEvents('primary', maxResults).toPromise();
      
      return response;
    } catch (error) {
      console.error('Error listing calendar events', error);
      throw error;
    }
  }
}