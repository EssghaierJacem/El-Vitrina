import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductRecommendation } from 'src/app/core/models/ProductReommendation/ProductRecommendation';
import { RecoService } from 'src/app/core/services/Recommendation/reco.service';

@Component({
  selector: 'app-quiz-result',
  imports: [CommonModule] ,
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.scss']
})
export class QuizResultComponent implements OnInit {

  recommendedProducts: ProductRecommendation[] = [];
  // à remplacer dynamiquement si besoin
  errorMessage = '';
  constructor(private recoService: RecoService) {}

  ngOnInit(): void {
    const userId = 1;
    this.recoService.getRecommendations(userId).subscribe({
      next: (recommendations) => {
        this.recommendedProducts = recommendations;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.errorMessage = 'Erreur lors de la récupération des recommandations.';
      }
    });
  }
}
