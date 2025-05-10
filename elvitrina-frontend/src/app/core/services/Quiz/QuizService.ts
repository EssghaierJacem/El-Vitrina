import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz } from 'src/app/core/models/Quiz/quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private apiUrl = '/api/quizzes';

  constructor(private http: HttpClient) {}

  createQuiz(quiz: Quiz): Observable<Quiz> {
    return this.http.post<Quiz>(this.apiUrl, quiz);
  }

  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.apiUrl);
  }

  getQuizById(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/getById/${id}`);
  }

  updateQuiz(id: number, quiz: Quiz): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.apiUrl}/update/${id}`, quiz);
  }

  deleteQuiz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  saveUserAnswer(quizId: number, userAnswer: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/${quizId}/answer`, {
      responseUser: userAnswer
    });
  }

}

