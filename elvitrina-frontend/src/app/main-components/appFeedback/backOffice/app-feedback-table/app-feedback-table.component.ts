import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-app-feedback-table',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './app-feedback-table.component.html',
  styleUrl: './app-feedback-table.component.scss'
})
export class AppFeedbackTableComponent {

}
