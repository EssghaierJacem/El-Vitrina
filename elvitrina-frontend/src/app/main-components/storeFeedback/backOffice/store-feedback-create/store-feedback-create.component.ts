import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-store-feedback-create',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './store-feedback-create.component.html',
  styleUrl: './store-feedback-create.component.scss'
})
export class StoreFeedbackCreateComponent {

}
