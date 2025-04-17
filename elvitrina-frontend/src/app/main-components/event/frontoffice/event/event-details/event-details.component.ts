import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { EventSession } from 'src/app/core/models/event/event-session.model';
import { VirtualEvent } from 'src/app/core/models/event/virtual-event.model';
import { GoogleCalendarService } from 'src/app/core/services/event/google-calendar.service';
import { VirtualEventService } from 'src/app/core/services/event/virtual-event.service';
import { MaterialModule } from 'src/app/material.module';
import { CalendarComponent } from './app-calendar.component';

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
      MatChipsModule,],
      standalone: true,
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: VirtualEvent ;
  loading = true;
  calendarEvents: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private virtualEventService: VirtualEventService ,
    private googleCalendar: GoogleCalendarService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loading = true;
      this.virtualEventService.getEventById(id).subscribe({
        next: (data) => {
          this.event = data;
          this.loading = false;
          console.log('Event data:', this.event.sessions[0]);
          // After loading event data
this.calendarEvents = this.event.sessions.map(session => ({
  title: session.sessionTitle,
  start: session.startTime,
  end: session.endTime
}));
        },
        error: (err) => {
          this.loading = false;
        }
      });
    }
  }

  async addToCalendar() {
    await this.googleCalendar.initClient();
    console.log("trest");
    
    const event = {
      summary: 'My Event',
      start: { dateTime: '2025-04-18T10:00:00+01:00' },
      end: { dateTime: '2025-04-18T12:00:00+01:00' },
    };

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
