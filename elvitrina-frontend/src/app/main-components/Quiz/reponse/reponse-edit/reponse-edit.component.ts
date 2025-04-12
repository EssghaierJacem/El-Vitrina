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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reponse-edit',
  imports: [ MatFormFieldModule,
      FormsModule,
      ReactiveFormsModule,
      MatCardModule,
      MatSelectModule,
      MatInputModule,
      MatButtonModule,
      MatOptionModule,
      CommonModule
    ],
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
      this.responseService.updateResponse(this.response.id!, this.response).subscribe({
        next: () => {
          if (this.response.questionId != null) {
            this.router.navigate(['/dashboard/question/view', this.response.questionId]);
          } else {
            console.warn("Aucun ID de question trouvé, redirection vers la liste.");
            this.router.navigate(['dashboard/question/list']); // ou une autre fallback route
          }
        },
        error: (error) => {
          console.error("Erreur lors de la mise à jour de la réponse :", error);
        }
      });
    }
  }}
