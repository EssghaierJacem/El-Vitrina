import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-store-feedback-edit',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './store-feedback-edit.component.html',
  styleUrl: './store-feedback-edit.component.scss'
})
export class StoreFeedbackEditComponent {

}
