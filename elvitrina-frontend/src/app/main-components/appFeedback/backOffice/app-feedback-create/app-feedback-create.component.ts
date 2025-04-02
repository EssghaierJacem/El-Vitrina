import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-app-feedback-create',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './app-feedback-create.component.html',
  styleUrl: './app-feedback-create.component.scss'
})
export class AppFeedbackCreateComponent {

}
