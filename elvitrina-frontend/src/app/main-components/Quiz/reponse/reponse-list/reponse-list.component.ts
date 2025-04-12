import { Component, OnInit } from '@angular/core';
import { Response } from 'src/app/core/models/Quiz/reponse';
import { Router } from '@angular/router';
import { ResponseService } from 'src/app/core/services/Quiz/ReponseService';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-reponse-list',
  imports: [MatFormFieldModule,
           FormsModule,
           MatTableModule,
           ReactiveFormsModule,
           MatCardModule,
           MatSelectModule,
           MatInputModule,
           MatButtonModule,
           MatIconModule,
           MatOptionModule],
  templateUrl: './reponse-list.component.html',
  styleUrl: './reponse-list.component.scss'
})
export class ReponseListComponent  implements OnInit {
  responses: Response[] = [];
  dataSource = new MatTableDataSource<Response>();
  constructor(private responseService: ResponseService, private router: Router) {}

  ngOnInit(): void {
    this.loadResponses();
  }

  loadResponses(): void {
    this.responseService.getAllResponses().subscribe({
      next: (data) => {
        this.responses = data;
      },
      error: (error) => {
        console.error("Erreur lors du chargement des réponses :", error);
      }
    });
  }

  editResponse(responseId: number): void {
    this.router.navigate(['/dashboard/response/edit', responseId]);
  }

  deleteResponse(responseId: number): void {
    if (confirm("Voulez-vous vraiment supprimer cette réponse ?")) {
      this.responseService.deleteResponse(responseId).subscribe({
        next: () => {
          this.responses = this.responses.filter(response => response.id !== responseId);
        },
        error: (error) => {
          console.error("Erreur lors de la suppression de la réponse :", error);
        }
      });
    }
  }
}
