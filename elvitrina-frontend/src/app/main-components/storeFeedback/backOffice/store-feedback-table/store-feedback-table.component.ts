import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-store-feedback-table',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './store-feedback-table.component.html',
  styleUrl: './store-feedback-table.component.scss'
})
export class StoreFeedbackTableComponent {

}
