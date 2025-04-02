import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-app-feedback-edit',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './app-feedback-edit.component.html',
  styleUrl: './app-feedback-edit.component.scss'
})
export class AppFeedbackEditComponent {

}
