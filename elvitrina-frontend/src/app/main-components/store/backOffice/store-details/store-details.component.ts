import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-store-details',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './store-details.component.html',
  styleUrl: './store-details.component.scss'
})
export class StoreDetailsComponent {

}
