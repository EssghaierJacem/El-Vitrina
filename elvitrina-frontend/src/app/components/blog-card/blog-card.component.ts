import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';

interface ProductCard {
    id: number;
    productName: string;
    price: number;
    imageUrl: string;
}

@Component({
    selector: 'app-blog-card',
    standalone: true,
    imports: [MatCardModule, TablerIconsModule, MatButtonModule],
    templateUrl: './blog-card.component.html',
})
export class AppBlogCardsComponent implements OnInit {

    constructor(private http: HttpClient) {}

    productcards: ProductCard[] = [];

    ngOnInit(): void {
        this.http.get<ProductCard[]>('http://localhost:8080/api/stats/top-products').subscribe({
            next: (data) => {
                this.productcards = data;
            },
            error: (err) => {
                console.error('Failed to fetch products', err);
            }
        });        
    }
    
    getImageUrlFromFilename(filename?: string): string {
        if (!filename) {
          return 'assets/images/products/no-image.jpg';
        }
      
        if (filename.startsWith('http://') || filename.startsWith('https://')) {
          return filename;
        }
      
        const cleaned = filename.replace(/^\/+/, '');
        return `http://localhost:8080/api/products/products/images/${cleaned}`;
      }
}
