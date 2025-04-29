import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ProductRecommendation } from "../../models/ProductReommendation/ProductRecommendation";
import { Observable } from "rxjs";
import { Product } from "../../models/product/product.model";

@Injectable({ providedIn: 'root'

})
export class RecoService {
  private apiUrl = 'http://127.0.0.1:5000/recommend';

  constructor(private http: HttpClient) {}

  getRecommendations(userId: number): Observable<ProductRecommendation[]> {
    return this.http.post<ProductRecommendation[]>(this.apiUrl, { user_id: userId });
  }
}
