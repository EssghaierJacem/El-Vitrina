import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-store-table',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './store-table.component.html',
  styleUrl: './store-table.component.scss'
})
export class StoreTableComponent {

}
