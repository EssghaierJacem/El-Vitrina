import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentService } from 'src/app/core/services/comment/commentService';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { Comment } from 'src/app/core/models/comment/comment.model';
import { BlogPost } from 'src/app/core/models/blogPost/blogPost.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-comment-edit',
  imports: [RouterModule, FormsModule, ReactiveFormsModule , MatFormFieldModule,  CommonModule,
    MatInputModule, MatButtonModule, MatSnackBarModule, MatIconModule, MatCardModule,
    MatProgressSpinnerModule],
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.scss']
})
export class CommentEditComponent implements OnInit {

  commentForm: FormGroup;
  commentId: number | null = null;
  blogPostId: number | null = null;
  isSubmitting: boolean = false;
  userId: number ; 
  
  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private route: ActivatedRoute,
    public router: Router,
    private tokenService: TokenService,
    private snackBar: MatSnackBar
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.commentId = +this.route.snapshot.paramMap.get('commentId')!;
    this.blogPostId = +this.route.snapshot.paramMap.get('id')!;



    if (this.commentId) {
      this.commentService.getCommentById(this.commentId).subscribe({
        next: (comment: Comment) => {
          this.commentForm.patchValue({
            content: comment.content
            
          });
        },
        error: (err) => {
          this.snackBar.open('Error fetching comment: ' + (err.error?.message || err.message), 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  updateComment(): void {
    if (this.commentForm.valid && this.commentId ) {
      const updatedComment: Comment = {
        id: this.commentId,
        content: this.commentForm.value.content,
        blogPost: { id: this.blogPostId } as BlogPost,
        user: { id: this.userId } as any
      };

      this.isSubmitting = true;

      this.commentService.updateComment(this.commentId, updatedComment).subscribe({
        next: () => {
          this.snackBar.open('Comment updated successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate([`/dashboard/blogPosts/${this.blogPostId}/comments`]);
        },
        error: (err) => {
          this.snackBar.open('Error updating comment: ' + (err.error?.message || err.message), 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
