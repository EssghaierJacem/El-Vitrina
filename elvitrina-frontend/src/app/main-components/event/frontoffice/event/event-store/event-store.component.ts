import { Component, Input, OnInit } from '@angular/core';
import { VirtualEventService } from 'src/app/core/services/event/virtual-event.service'; // Update this path
import { VirtualEvent } from 'src/app/core/models/event/virtual-event.model'; // Update this path
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-event-store',
  templateUrl: './event-store.component.html',
  imports: [CommonModule],
  styleUrls: ['./event-store.component.scss']
})
export class EventStoreComponent  implements OnInit {
 @Input() events: VirtualEvent[] = [];
  loading: boolean = true;
  error: string | null = null;
  constructor(private eventService: VirtualEventService ,     private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.events);
    this.loading = false;
  }


  formatDate(date: Date): string {
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

    
  getImageUrl(filename: string): string {
    
    console.log(this.eventService.getImageUrl(filename));
    return this.eventService.getImageUrl(filename);
  }
  
}
















// 142694823722-vn9tr868ru9u2bscq9lfqvu2imo85hn6.apps.googleusercontent.com
// AIzaSyBAVxZ3Cokmiib7sHq5ZsU5nTd-CjHfnW8