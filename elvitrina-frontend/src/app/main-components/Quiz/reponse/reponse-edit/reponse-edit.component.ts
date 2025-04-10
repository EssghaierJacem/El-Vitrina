import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from 'src/app/core/models/Quiz/reponse';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ResponseService } from 'src/app/core/services/Quiz/ReponseService';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-reponse-edit',
  imports: [ MatFormFieldModule,
      FormsModule,
      ReactiveFormsModule,
      MatCardModule,
      MatSelectModule,
      MatInputModule,
      MatButtonModule,
      MatOptionModule],
  templateUrl: './reponse-edit.component.html',
  styleUrl: './reponse-edit.component.scss'
})
export class ReponseEditComponent implements OnInit {
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
    const responseId = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(responseId)) {
      this.responseService.getResponseById(responseId).subscribe({
        next: (res) => {
          this.response = res;
        },
        error: (error) => {
          console.error("Erreur lors du chargement de la réponse :", error);
        }
      });
    }
  }

  editResponse(form: NgForm): void {
    if (form.valid) {
      this.responseService.editResponse(this.response.id, this.response).subscribe({
        next: () => {
          console.log("Réponse mise à jour avec succès");
          this.router.navigate(['/questions/view', this.response.questionId]); // Retour à la question
        },
        error: (error) => {
          console.error("Erreur lors de la mise à jour de la réponse :", error);
        }
      });
    }
  }}
