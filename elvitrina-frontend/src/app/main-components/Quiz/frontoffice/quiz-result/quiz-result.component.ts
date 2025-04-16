import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductRecommendation } from 'src/app/core/models/ProductReommendation/ProductRecommendation';
import { RecoService } from 'src/app/core/services/Recommendation/reco.service';

@Component({
  selector: 'app-quiz-result',
  imports: [CommonModule],
  templateUrl: './quiz-result.component.html',
  styleUrl: './quiz-result.component.scss'
})
export class QuizResultComponent implements OnInit {
  quizAnswers: string[] = [];  // Contient les réponses du quiz
  recommendedProducts: ProductRecommendation[] = [];

  constructor(private recoService: RecoService) {}

  ngOnInit() {
    // Assume que `quizAnswers` est un tableau des réponses utilisateurs
    this.recoService.getRecommendations(this.quizAnswers).subscribe(products => {
      this.recommendedProducts = products;
    });
  }
}
