import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-store-feedback-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './store-feedback-details.component.html',
  styleUrl: './store-feedback-details.component.scss'
})
export class StoreFeedbackDetailsComponent {

}
