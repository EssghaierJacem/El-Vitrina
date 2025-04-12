import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { Response } from 'src/app/core/models/Quiz/reponse';
import { ResponseService } from 'src/app/core/services/Quiz/ReponseService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reponse-view',
  imports: [
    MatCardModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      CommonModule,
      FormsModule,
    ],
  templateUrl: './reponse-view.component.html',
  styleUrl: './reponse-view.component.scss'
})
export class ReponseViewComponent  implements OnInit {
  response!: Response; // La réponse sélectionnée

  constructor(
    private route: ActivatedRoute,
    private responseService: ResponseService
  ) {}

  ngOnInit(): void {
    this.getResponseDetails();
  }

  getResponseDetails(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.responseService.getResponseById(id).subscribe({
        next: (data) => {
          this.response = data;
        },
        error: (error) => {
          console.error('Erreur lors de la récupération de la réponse:', error);
        }
      });
    }
  }
}
