import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnChanges {
  @Input() rating: number = 0;
  @Input() starSize: 'small' | 'medium' | 'large' = 'medium';
  stars: { filled: boolean, half: boolean }[] = Array(5).fill({ filled: false, half: false });
  showRating: boolean = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rating']) {
      this.updateStars();
    }
  }

  private updateStars(): void {
    const fullStars = Math.floor(this.rating);
    const hasHalfStar = this.rating % 1 >= 0.5 && this.rating % 1 < 1;

    this.stars = this.stars.map((_, index) => {
      if (index < fullStars) {
        return { filled: true, half: false };
      } else if (index === fullStars && hasHalfStar) {
        return { filled: false, half: true };
      } else {
        return { filled: false, half: false };
      }
    });
  }

  get iconSize(): string {
    switch (this.starSize) {
      case 'small': return '16px';
      case 'large': return '24px';
      default: return '20px';
    }
  }
}