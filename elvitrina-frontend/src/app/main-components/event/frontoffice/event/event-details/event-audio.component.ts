import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AudioSummaryResponse, EventAudioService } from 'src/app/core/services/event/event-audio.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'event-audio',
  templateUrl: './event-audio.component.html',
  styleUrls: ['./event-audio.component.scss'],
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
    MatProgressBarModule
  ]
})
export class EventAudioSummaryComponent implements OnInit, OnDestroy {
  @Input() eventId: number;
  @Input() eventTitle: string;
  
  isLoading: boolean = false;
  hasSummary: boolean = false;
  isReading: boolean = false;
  readingProgress: number = 0;
  summaryText: string = '';
  
  private speechSynthesis: SpeechSynthesis;
  private speechUtterance: SpeechSynthesisUtterance;
  private readingInterval: any;
  private destroy$ = new Subject<void>();
  
  constructor(
    private audioService: EventAudioService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    // Initialize speech synthesis
    this.speechSynthesis = window.speechSynthesis;
    this.speechUtterance = new SpeechSynthesisUtterance();
    this.setupSpeechListeners();
    
    // Check if we already have a summary for this event
    this.checkExistingSummary();
  }
  
  private checkExistingSummary(): void {
    this.isLoading = true;
    
    this.audioService.getAudioSummary(this.eventId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          if (response && response.summaryText) {
            this.setupSummary(response);
          } else {
            this.hasSummary = false;
          }
        },
        error: () => {
          this.hasSummary = false;
          this.snackBar.open('Error checking for existing summary', 'Close', { duration: 3000 });
        }
      });
  }

  private setupSummary(response: AudioSummaryResponse): void {
    this.hasSummary = true;
    this.summaryText = response.summaryText;
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopReading();
  }
  
  private setupSpeechListeners(): void {
    this.speechUtterance.onstart = () => {
      this.isReading = true;
      this.startProgressUpdates();
    };
    
    this.speechUtterance.onend = () => {
      this.onReadingEnd();
    };
    
    this.speechUtterance.onerror = () => {
      this.onReadingError();
    };
  }

  private startProgressUpdates(): void {
    this.clearProgressInterval();
    let startTime = Date.now();
    const estimatedDuration = this.summaryText.length * 50; // Rough estimate: 50ms per character
    
    this.readingInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      this.readingProgress = Math.min((elapsed / estimatedDuration) * 100, 99);
    }, 100);
  }

  private clearProgressInterval(): void {
    if (this.readingInterval) {
      clearInterval(this.readingInterval);
    }
  }

  private onReadingEnd(): void {
    this.isReading = false;
    this.readingProgress = 100;
    this.clearProgressInterval();
  }

  private onReadingError(): void {
    this.snackBar.open('Error reading summary text', 'Close', { duration: 3000 });
    this.isReading = false;
    this.clearProgressInterval();
  }

  toggleReading(): void {
    if (!this.hasSummary) {
      this.generateSummary();
      return;
    }
    
    if (this.isReading) {
      this.stopReading();
    } else {
      this.startReading();
    }
  }

  startReading(): void {
    if (!this.summaryText) {
      this.snackBar.open('Summary text not available', 'Close', { duration: 3000 });
      return;
    }
    
    // Configure and start speech synthesis
    this.speechUtterance.text = this.summaryText;
    this.speechUtterance.rate = 1.0;
    this.speechUtterance.pitch = 1.0;
    this.speechUtterance.volume = 1.0;
    this.speechUtterance.lang = 'en-US';
    
    this.speechSynthesis.speak(this.speechUtterance);
  }

  stopReading(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
      this.isReading = false;
      this.clearProgressInterval();
    }
  }
  
  generateSummary(): void {
    this.isLoading = true;
    
    this.audioService.generateAudioSummary(this.eventId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response: AudioSummaryResponse) => {
          this.hasSummary = true;
          this.summaryText = response.summaryText;
          this.snackBar.open('Summary generated successfully', 'Close', { duration: 3000 });
        },
        error: (error: any) => {
          console.error('Error generating summary:', error);
          this.snackBar.open('Failed to generate summary', 'Close', { duration: 3000 });
        }
      });
  }
  
  copySummaryToClipboard(): void {
    if (!this.summaryText) {
      this.snackBar.open('No summary available to copy', 'Close', { duration: 3000 });
      return;
    }
    
    navigator.clipboard.writeText(this.summaryText).then(
      () => {
        this.snackBar.open('Summary copied to clipboard', 'Close', { duration: 2000 });
      },
      () => {
        this.snackBar.open('Failed to copy summary to clipboard', 'Close', { duration: 3000 });
      }
    );
  }
}