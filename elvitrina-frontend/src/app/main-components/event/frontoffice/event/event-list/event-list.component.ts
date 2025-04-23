import { Component, OnInit } from '@angular/core';
import { VirtualEventService } from 'src/app/core/services/event/virtual-event.service'; // Update this path
import { VirtualEvent } from 'src/app/core/models/event/virtual-event.model'; // Update this path
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  imports: [CommonModule],
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events: VirtualEvent[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private eventService: VirtualEventService ,     private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.loading = true;
    this.eventService.getAllEvents().subscribe({
      next: (data: VirtualEvent[]) => {
        this.events = data;
        this.loading = false;
        console.log(this.events);
        
      },
      error: (err: any) => {
        console.error('Error fetching events:', err);
        this.error = 'Failed to load events. Please try again later.';
        this.loading = false;
      }
    });
  }

  // Helper function to format date
  formatDate(date: Date): string {
    console.log(date);
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short'
    });
  }
  goToEvent(eventId: number) {
    console.log(eventId);
    
    this.router.navigate(['/events', eventId]);
  }
  // Calculate percentage of participants
  getParticipantPercentage(event: VirtualEvent): number {
    if (!event.maxParticipants) return 0;
    const currentParticipants = event.participants?.length || 0;
    return Math.round((currentParticipants / event.maxParticipants) * 100);
  }
}
















// 142694823722-vn9tr868ru9u2bscq9lfqvu2imo85hn6.apps.googleusercontent.com
// AIzaSyBAVxZ3Cokmiib7sHq5ZsU5nTd-CjHfnW8