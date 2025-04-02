import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-store-edit',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './store-edit.component.html',
  styleUrl: './store-edit.component.scss'
})
export class StoreEditComponent {

}
