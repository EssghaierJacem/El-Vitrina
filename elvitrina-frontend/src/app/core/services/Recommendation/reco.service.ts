import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ProductRecommendation } from "../../models/ProductReommendation/ProductRecommendation";
import { Observable } from "rxjs";

// reco.service.ts
@Injectable({ providedIn: 'root' })
export class RecoService {
  constructor(private http: HttpClient) {}

  getRecommendations(answers: string[]): Observable<ProductRecommendation[]> {
    return this.http.post<ProductRecommendation[]>('http://localhost:8080/api/recommend', answers);
  }
}
