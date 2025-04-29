import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../../models/comment/comment.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) {}

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl);
  }

  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/${id}`);
  }

  createComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/addcomment`, comment);
  }

  updateComment(id: number, comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${id}/updatecomment`, comment);
  }

  

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}` + "/removecomment");
  }


  getCommentsByBlogPost(blogPostId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/blog-post/${blogPostId}`);
  }
}
