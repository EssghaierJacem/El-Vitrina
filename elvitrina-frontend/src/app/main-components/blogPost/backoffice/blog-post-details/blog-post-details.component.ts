import { Component, OnInit } from '@angular/core';
import { BlogPostService } from 'src/app/core/services/blogPost/blogPostService';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogPost } from 'src/app/core/models/blogPost/blogPost.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';  // For reactive forms
import { MatCardModule } from '@angular/material/card';  // For mat-card
import { MatFormFieldModule } from '@angular/material/form-field';  // For mat-form-field
import { MatInputModule } from '@angular/material/input';  // For matInput
import { MatButtonModule } from '@angular/material/button';  // For mat-button
import { MatIconModule } from '@angular/material/icon';  // For mat-icon
import { MatSnackBarModule } from '@angular/material/snack-bar';  // For Snackbar notifications
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';  // CommonModule to ensure common Angular directives
import { MatDividerModule } from '@angular/material/divider'; // For mat-divider
import { CommentService } from 'src/app/core/services/comment/commentService';  // Assuming a service for comments
import { Comment } from 'src/app/core/models/comment/comment.model';  // Assuming a comment model
import { TokenService } from 'src/app/core/services/user/TokenService';

@Component({
  selector: 'app-blog-post-details',
  imports: [
    CommonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,  
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './blog-post-details.component.html',
  styleUrls: ['./blog-post-details.component.scss']
})
export class BlogPostDetailsComponent implements OnInit {
  blogPost!: BlogPost;
  isLoading: boolean = true;
  errorMessage: string = '';
  newComment: string = '';  // Store the new comment text
  commentForm: FormGroup;  // FormGroup for adding comment

  userId: number | null = null;

  // URL de base pour accéder aux images
  baseUrl: string = '/api/images/'; // Remplace avec ton URL de serveur d'images

  constructor(
    private blogPostService: BlogPostService,
    private commentService: CommentService,  // Inject the comment service
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private tokenService: TokenService,
    private snackBar: MatSnackBar
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required]]  // Validate comment input
    });
  }

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (!token) {
      this.snackBar.open('Please log in to create a formation', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/authentication/login']);
    } else {
      const decoded = this.tokenService.getDecodedToken();
      this.userId = decoded?.id ?? null;
    }

    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.getBlogPostDetails(Number(postId));
    }
  }

  getBlogPostDetails(id: number): void {
    this.blogPostService.getBlogPostById(id).subscribe(
      (data: BlogPost) => {
        this.blogPost = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error fetching post details';
        this.isLoading = false;
      }
    );
  }

  // Méthode pour obtenir l'URL complète de l'image
  getImageUrl(imagePath: string): string {
    return this.baseUrl + imagePath;
  }
}