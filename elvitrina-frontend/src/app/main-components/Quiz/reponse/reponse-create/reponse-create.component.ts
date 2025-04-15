import { Component } from '@angular/core';
import { Response } from 'src/app/core/models/Quiz/reponse';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ResponseService } from 'src/app/core/services/Quiz/ReponseService';
import { MatInputModule } from '@angular/material/input';  // Pour matInput
import { MatButtonModule } from '@angular/material/button';  // Pour les boutons
import { MatCardModule } from '@angular/material/card';  // Pour mat-card
import { MatSelectModule } from '@angular/material/select';  // Pour mat-select (si nécessaire)
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-reponse-create',
  imports: [
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule
  ],
  templateUrl: './reponse-create.component.html',
  styleUrl: './reponse-create.component.scss'
})
export class ReponseCreateComponent {
  response: Response = {
    id: 0,
    response: '',
    questionId: 0
  };

  constructor(
    private responseService: ResponseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const questionId = Number(this.route.snapshot.paramMap.get('questionId'));
    if (!isNaN(questionId)) {
      this.response.questionId = questionId;
    }
  }

  createResponse(form: NgForm): void {
    if (form.valid) {
      this.responseService.createResponse(this.response).subscribe({
        next: () => {
          console.log('Réponse créée avec succès');
          this.router.navigate(['/questions/view', this.response.questionId]); // Retour à la question
        },
        error: (error) => {
          console.error('Erreur lors de la création de la réponse:', error);
        }
      });
    }
  }
}
