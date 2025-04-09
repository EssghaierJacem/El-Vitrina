import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from 'src/app/core/services/comment/commentService';
import { BlogPostService } from 'src/app/core/services/blogPost/blogPostService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Comment } from 'src/app/core/models/comment/comment.model';
import { BlogPost } from 'src/app/core/models/blogPost/blogPost.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-comment-list',
  imports: [
    RouterModule,       // Required for routerLink
    MatIconModule,      // Required for mat-icon
    CommonModule, 
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule      // Required for date pipe
  ],
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
  blogPost: BlogPost | null = null;
  comments: Comment[] = [];
  blogPostId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private commentService: CommentService,
    private blogPostService: BlogPostService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Get the blog post ID from the route parameters
    this.blogPostId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.blogPostId) {
      this.fetchBlogPost();
      this.fetchComments();
    } else {
      this.snackBar.open('Invalid blog post ID.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  // Fetch the blog post details
  fetchBlogPost(): void {
    this.blogPostService.getBlogPostById(this.blogPostId!).subscribe({
      next: (response: BlogPost) => {
        this.blogPost = response;
      },
      error: (err) => {
        this.snackBar.open('Error fetching blog post: ' + (err.error?.message || err.message), 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  // Fetch the comments associated with the blog post
  fetchComments(): void {
    this.commentService.getCommentsByBlogPost(this.blogPostId!).subscribe({
      next: (response: Comment[]) => {
        this.comments = response;
      },
      error: (err) => {
        this.snackBar.open('Error fetching comments: ' + (err.error?.message || err.message), 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  // Handle delete comment
  deleteComment(commentId: number): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.snackBar.open('Comment deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.fetchComments();  // Refresh the comments list
      },
      error: (err) => {
        this.snackBar.open('Error deleting comment: ' + (err.error?.message || err.message), 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  // Redirect to the page for adding a new comment
  addComment(): void {
    this.router.navigate(['/dashboard/blogPosts', this.blogPostId, 'add-comment']);
  }
}

