import { Component, OnInit } from '@angular/core';
import { BlogPost } from 'src/app/core/models/blogPost/blogPost.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from 'src/app/core/services/comment/commentService';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BlogPostService } from 'src/app/core/services/blogPost/blogPostService';
import { Comment } from 'src/app/core/models/comment/comment.model';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-comment-create',
  imports: [RouterModule, FormsModule, ReactiveFormsModule , MatFormFieldModule,  CommonModule,
    MatInputModule, MatButtonModule, MatSnackBarModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule,
    MatProgressSpinnerModule],
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.scss']
})
export class CommentCreateComponent implements OnInit {

  commentForm: FormGroup;
  blogPostId: number | null = null;
  userId: number | null = null;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private blogPostService: BlogPostService,
    private route: ActivatedRoute,
    public router: Router,
    private tokenService: TokenService,
    private snackBar: MatSnackBar
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required]]  // Validator for content
    });
  }

  ngOnInit(): void {
    // Check if the user is authenticated
    const token = this.tokenService.getToken();
    if (!token) {
      this.snackBar.open('Please log in to add a comment', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/authentication/login']);
    } else {
      const decoded = this.tokenService.getDecodedToken();
      this.userId = decoded?.id ?? null;
    }

    // Retrieve the blog post ID from the route parameters
    this.blogPostId = Number(this.route.snapshot.paramMap.get('id'));
  }

  submitComment(): void {
    if (this.commentForm.valid && this.blogPostId && this.userId) {
      // Create a Comment object with user ID and blog post ID
      const newComment: Comment = {
        blogPost: { id: this.blogPostId } as BlogPost,
        content: this.commentForm.value.content,
        user: { id: this.userId } as any
      };

      // Call the service to create the comment
      this.commentService.createComment(newComment).subscribe({
        next: (response: Comment) => {
          this.snackBar.open('Comment created successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate([`/dashboard/blogPosts/${this.blogPostId}/comments`]);
        },
        error: (err) => {
          this.snackBar.open('Error creating comment: ' + (err.error?.message || err.message), 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isSubmitting = false;
        }
      });
      
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }
}
