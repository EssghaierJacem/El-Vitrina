import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPost } from '../../models/blogPost/blogPost.model';
import { TranslationRequest, TranslationResponse } from '../../models/blogPost/traduction.model';

@Injectable({
  providedIn: 'root'
})
export class BlogPostService {
  private apiUrl = '/api/blogposts';

  constructor(private http: HttpClient) {}

  getAllBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(this.apiUrl + "/getblogposts");
  }

  getBlogPostById(id: number): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/${id}`);
  }

  /*
  createBlogPost(blogPost: BlogPost): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.apiUrl}/addblogpost`, blogPost);
  }
  */

  createBlogPost(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addblogpost`, formData);
  }


  updateBlogPost(id: number, blogPost: BlogPost): Observable<BlogPost> {
    return this.http.put<BlogPost>(`${this.apiUrl}/${id}/updateblogpost` , blogPost);
  }

  deleteBlogPost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}` + "/removeblogpost");
  }



  likePost(postId: number): Observable<BlogPost> {
    return this.http.patch<BlogPost>(`${this.apiUrl}/${postId}/like`, {});
  }
  
  unlikePost(postId: number): Observable<BlogPost> {
    return this.http.patch<BlogPost>(`${this.apiUrl}/${postId}/unlike`, {});
  }

  translateText(request: TranslationRequest): Observable<TranslationResponse> {
    const url = `/api/translation/translate`; // Endpoint matching the Spring @PostMapping
    return this.http.post<TranslationResponse>(url, request);
  }
  
}
