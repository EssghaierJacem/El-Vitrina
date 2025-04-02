import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-store-create',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './store-create.component.html',
  styleUrl: './store-create.component.scss'
})
export class StoreCreateComponent {

}
