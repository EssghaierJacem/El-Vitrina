import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VirtualEventService } from 'src/app/core/services/event/virtual-event.service';
import { EventParticipantService } from 'src/app/core/services/event/event-participant.service';
import { EventTicketService } from 'src/app/core/services/event/event-ticket.service';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { MatListModule } from '@angular/material/list';
import { EventTicket } from 'src/app/core/models/event/event-ticket.model';
import { EventParticipant, EventParticipantEvent, EventParticipantRequest } from 'src/app/core/models/event/event-participant.model';
import { QRCodeComponent } from 'angularx-qrcode';
import { Title } from 'chart.js';

@Component({
  selector: 'app-seat-booking',
  templateUrl: './seat-booking.component.html',
  styleUrls: ['./seat-booking.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TablerIconsModule,
    MaterialModule,
    MatListModule,
    QRCodeComponent,
  ],
})
export class SeatBookingComponent implements OnInit {
  @Input() eventId!: number;
  @Input() EventParticipant: EventParticipantEvent[] = [];
  @Input() eventTitle: string = '';
  @Input() eventLocation: string = '';
  @Input() eventImage: string = '';
  @Input() ticketPrice: number = 30;
  @Input() eventDate: Date | string = new Date();
  @Input() maxParticipants: number = 30;

  cols: number = 0;
  seats: { id: string; status: 'available' | 'booked' | 'selected' | 'empty' }[] = [];
  selectedSeats: string[] = [];
  reservedSeatIds: string[] = [];
  currentDate: Date = new Date();
  userId: number | null = this.authService.getUserId();
  hasExistingBooking: boolean = false;
  qrData: string = '';
  isQRCodeZoomed = false;
  existingBookingDetails: EventTicket | null = null;

  private monthMap = new Map<number, string>([
    [1, 'January'], [2, 'February'], [3, 'March'], [4, 'April'],
    [5, 'May'], [6, 'June'], [7, 'July'], [8, 'August'],
    [9, 'September'], [10, 'October'], [11, 'November'], [12, 'December'],
  ]);

  constructor(
    private virtualEventService: VirtualEventService,
    private eventParticipantService: EventParticipantService,
    private eventTicketService: EventTicketService,
    private authService: TokenService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkExistingBooking();
  }

  private calculateGridDimensions(maxParticipants: number): { rows: number; cols: number } {
    if (maxParticipants <= 0) {
      return { rows: 1, cols: 2 };
    }
    const sqrt = Math.sqrt(maxParticipants);
    let rows = Math.ceil(sqrt);
    let cols = Math.ceil(maxParticipants / rows);
    cols += 1;
    while (rows * (cols - 1) < maxParticipants) {
      rows++;
    }
    if (maxParticipants <= 10) {
      rows = 1;
      cols = maxParticipants + 1;
    }
    return { rows, cols };
  }

  initializeSeats(): void {
    const { rows, cols } = this.calculateGridDimensions(this.maxParticipants);
    const seatAbbrev = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, rows);
    this.cols = cols;
    this.seats = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (j === Math.floor(cols / 2)) {
          this.seats.push({ id: `label-${seatAbbrev.charAt(i)}`, status: 'empty' });
        } else {
          const seatId = `${seatAbbrev.charAt(i)}-${j < Math.floor(cols / 2) ? j + 1 : j}`;
          const status = this.reservedSeatIds.includes(seatId) ? 'booked' : 'available';
          this.seats.push({ id: seatId, status });
        }
      }
    }
    this.cdr.markForCheck();
  }

  checkExistingBooking(): void {
    if (!this.userId) {
      this.snackBar.open('User not logged in', 'Close', { duration: 3000 });
      this.initializeSeats();
      return;
    }
  
    this.hasExistingBooking = this.hasUserJoined();
    this.cdr.detectChanges();

  
    if (this.hasExistingBooking) {
        
      this.eventParticipantService.getParticipantsByUserId(this.userId).subscribe({
        next: (eventParticipant: EventParticipant) => {
          if (eventParticipant) {
            this.existingBookingDetails = eventParticipant.eventTicket;
            console.log("****", eventParticipant.eventTicket);
            
            this.generateQRData();
            this.cdr.markForCheck();

          } else {
            // No booking found for the user
            this.hasExistingBooking = false;
          }
          console.log("****");
            
            console.log(eventParticipant);
        },
        error: () => {
          this.snackBar.open('Failed to load ticket details', 'Close', { duration: 3000 });
          this.initializeSeats();
        },
      });
    } 
      // Handle loading reserved seats for the event
      this.eventTicketService.getTicketsByEventId(this.eventId).subscribe({
        next: (tickets: EventTicket[]) => {
          this.reservedSeatIds = tickets.flatMap(ticket =>
            (ticket.seats?.map(seat => seat.seatId).filter((id): id is string => !!id)) || []
          );
          this.initializeSeats();
          this.cdr.markForCheck();
        },
        error: () => {
          this.snackBar.open('Failed to load reserved seats', 'Close', { duration: 3000 });
          this.initializeSeats();
        },
      });
    
  }
  

  hasUserJoined(): boolean {
    console.log("Event Participants:", this.EventParticipant);
    console.log("User ID:", this.userId);
    
    if (!this.EventParticipant || !this.userId) return false;
    return this.EventParticipant.some(p => p.userId === this.userId);
  }

  generateQRData(): void {
    if (!this.existingBookingDetails) return;
  
    const seatsList = this.existingBookingDetails.seats?.map(s => s.seatId).join(", ") || "None";
    const price = `$${this.existingBookingDetails.price.toFixed(2)}`;
    const title = this.eventTitle.substring(0, 10); // First 10 characters
    const date = this.getFormattedDate();
  console.log("****", this.eventTitle, this.eventDate, this.ticketPrice);
  
    // User-friendly description format
    this.qrData = `
      🎟️ This is your ticket!
      🎉 Event: ${title}
      📅 Date: ${date}
      💺 Seats: ${seatsList}
      💵 Price: ${price}
    `.trim();
  }
  

  getBookedSeatsDisplay(): string {
    return this.existingBookingDetails?.seats?.map(s => s.seatId).join(', ') || '-';
  }

  toggleSeatSelection(seat: { id: string; status: string }): void {
    if (seat.status === 'booked' || seat.status === 'empty' || this.hasExistingBooking) return;

    if (seat.status === 'available' && this.selectedSeats.length >= this.maxParticipants) {
      this.snackBar.open(`You can select up to ${this.maxParticipants} seats`, 'Close', { duration: 3000 });
      return;
    }

    if (seat.status === 'available') {
      seat.status = 'selected';
      this.selectedSeats.push(seat.id);
    } else if (seat.status === 'selected') {
      seat.status = 'available';
      const index = this.selectedSeats.indexOf(seat.id);
      if (index !== -1) {
        this.selectedSeats.splice(index, 1);
      }
    }
    this.selectedSeats.sort();
    this.cdr.markForCheck();
  }

  getFormattedDate(): string {
    const date = this.eventDate instanceof Date ? this.eventDate : new Date(this.eventDate);
    return `${this.monthMap.get(date.getMonth() + 1)} ${date.getDate()}`;
  }

  getTotalPrice(): number {
    return this.selectedSeats.length * this.ticketPrice;
  }

  bookNow(): void {
    if (this.selectedSeats.length === 0) {
      this.snackBar.open('Please select at least one seat to book.', 'Close', { duration: 3000 });
      return;
    }
    if (this.userId === null) {
      this.snackBar.open('You must be logged in to book seats.', 'Close', { duration: 3000 });
      return;
    }

    const request: EventParticipantRequest = {
      userId: this.userId,
      eventId: this.eventId,
      ticketCount: this.selectedSeats.length,
      seatIds: this.selectedSeats,
    };

    this.eventParticipantService.registerParticipant(request).subscribe({
      next: () => {
        this.snackBar.open(`Successfully booked ${this.selectedSeats.length} seat(s)`, 'Close', { duration: 3000 });
        this.seats.forEach(seat => {
          if (seat.status === 'selected') {
            seat.status = 'booked';
          }
        });
        this.selectedSeats = [];
        this.checkExistingBooking();
        this.cdr.markForCheck();
      },
      error: () => {
        this.snackBar.open('Failed to book seats', 'Close', { duration: 3000 });
      },
    });
  }
}